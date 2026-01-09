import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { SyncRepository } from './sync.repository';
import { ArticlesRepository } from '../articles/articles.repository';
import { SyncRequestDto } from './dto/sync-request.dto';
import { newsApiConfig, getNewsApiKey } from '../../config/newsapi.config';
import { VALID_CATEGORIES } from '../../common/constants/categories.constant';

@Injectable()
export class SyncService {
  private lastSyncTime: Date | null = null;
  private isRunning = false;

  constructor(
    private syncRepository: SyncRepository,
    private articlesRepository: ArticlesRepository,
  ) {}

  async syncArticles(syncRequestDto: SyncRequestDto, userId: string) {
    const cooldownMinutes = parseInt(process.env.SYNC_COOLDOWN_MINUTES || '5');
    const cooldownMs = cooldownMinutes * 60 * 1000;

    if (
      this.lastSyncTime &&
      Date.now() - this.lastSyncTime.getTime() < cooldownMs
    ) {
      const remainingSeconds = Math.ceil(
        (cooldownMs - (Date.now() - this.lastSyncTime.getTime())) / 1000,
      );
      throw new BadRequestException({
        message: `Sync cooldown active. Please wait ${Math.ceil(remainingSeconds / 60)} minutes before next sync.`,
        error: {
          code: 'SYNC_COOLDOWN',
          details: {
            remainingSeconds,
            lastSyncAt: this.lastSyncTime.toISOString(),
          },
        },
      });
    }

    if (this.isRunning) {
      throw new BadRequestException('Sync is already running');
    }

    this.isRunning = true;
    const startedAt = new Date();
    let syncedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let status = 'success';
    let errorMessage = null;

    try {
      const categories =
        syncRequestDto.categories && syncRequestDto.categories.length > 0
          ? syncRequestDto.categories
          : VALID_CATEGORIES;

      const country = syncRequestDto.country || newsApiConfig.defaultCountry;
      const pageSize =
        syncRequestDto.pageSize || newsApiConfig.defaultPageSize;

      for (const category of categories) {
        try {
          const articles = await this.fetchArticlesFromNewsApi(
            category,
            country,
            pageSize,
          );

          for (const article of articles) {
            try {
              const apiId = this.generateApiId(article);
              const existingArticle =
                await this.articlesRepository.findByApiId(apiId);

              const articleData = {
                apiId,
                title: article.title || 'Untitled',
                description: article.description,
                content: article.content,
                url: article.url,
                imageUrl: article.urlToImage,
                source: article.source?.name,
                author: article.author,
                category: category,
                publishedAt: article.publishedAt,
                lastSyncedAt: new Date().toISOString(),
              };

              if (existingArticle) {
                await this.articlesRepository.update(
                  existingArticle.id,
                  articleData,
                );
                updatedCount++;
              } else {
                await this.articlesRepository.create(articleData);
                syncedCount++;
              }
            } catch (error) {
              console.error('Error syncing article:', error.message);
              skippedCount++;
            }
          }
        } catch (error) {
          console.error(`Error syncing category ${category}:`, error.message);
          status = 'partial';
        }
      }
    } catch (error) {
      status = 'failed';
      errorMessage = error.message;
      throw new InternalServerErrorException(
        `Sync failed: ${error.message}`,
      );
    } finally {
      this.isRunning = false;
      this.lastSyncTime = new Date();

      const completedAt = new Date();
      const durationMs = completedAt.getTime() - startedAt.getTime();

      await this.syncRepository.createSyncLog({
        syncedCount,
        updatedCount,
        skippedCount,
        status,
        errorMessage,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs,
        triggeredBy: userId,
      });

      return {
        syncedCount,
        updatedCount,
        skippedCount,
        lastSyncAt: completedAt.toISOString(),
        duration: durationMs,
        triggeredBy: {
          id: userId,
          name: 'Admin',
        },
      };
    }
  }

  async getSyncStatus() {
    const lastSync = await this.syncRepository.getLastSync();
    const totalArticles = await this.syncRepository.getTotalArticles();

    const cooldownMinutes = parseInt(process.env.SYNC_COOLDOWN_MINUTES || '5');
    const cooldownMs = cooldownMinutes * 60 * 1000;

    let canSyncNow = true;
    let nextAvailableSync: string | null = null;
    let cooldownRemaining = 0;

    if (this.lastSyncTime) {
      const timeSinceLastSync = Date.now() - this.lastSyncTime.getTime();
      if (timeSinceLastSync < cooldownMs) {
        canSyncNow = false;
        cooldownRemaining = Math.ceil((cooldownMs - timeSinceLastSync) / 1000);
        nextAvailableSync = new Date(
          this.lastSyncTime.getTime() + cooldownMs,
        ).toISOString();
      }
    }

    return {
      lastSyncAt: lastSync?.startedAt || null,
      totalArticles,
      isRunning: this.isRunning,
      canSyncNow,
      nextAvailableSync,
      cooldownRemaining,
      lastTriggeredBy: lastSync?.triggerer
        ? {
            name: lastSync.triggerer.name,
            email: lastSync.triggerer.email,
          }
        : null,
    };
  }

  async getSyncLogs(page: number = 1, limit: number = 20, status?: string) {
    const { data, total } = await this.syncRepository.getSyncLogs(
      page,
      limit,
      status,
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async fetchArticlesFromNewsApi(
    category: string,
    country: string,
    pageSize: number,
  ) {
    try {
      const apiKey = getNewsApiKey();
      const url = `${newsApiConfig.baseUrl}/top-headlines`;

      const response = await axios.get(url, {
        params: {
          apiKey,
          category,
          country,
          pageSize,
        },
      });

      if (response.data.status !== 'ok') {
        throw new Error('News API returned error status');
      }

      return response.data.articles || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `News API error: ${error.response?.data?.message || error.message}`,
        );
      }
      throw error;
    }
  }

  private generateApiId(article: any): string {
    const source = article.source?.name || 'unknown';
    const title = article.title || 'untitled';
    const hash = crypto
      .createHash('md5')
      .update(`${source}_${title}`)
      .digest('hex')
      .substring(0, 8);

    return `newsapi_${source.toLowerCase().replace(/\s+/g, '_')}_${hash}`;
  }
}

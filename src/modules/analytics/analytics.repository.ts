import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { SyncLog } from '../sync/entities/sync-log.entity';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(SyncLog)
    private readonly syncLogRepository: Repository<SyncLog>,
  ) {}

  async getCategoryDistribution(dateFrom?: string, dateTo?: string) {
    const queryBuilder =
      this.articleRepository.createQueryBuilder('article');

    if (dateFrom && dateTo) {
      queryBuilder.where('article.publishedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    } else if (dateFrom) {
      queryBuilder.where('article.publishedAt >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.where('article.publishedAt <= :dateTo', { dateTo });
    }

    const articles = await queryBuilder.select('article.category').getMany();

    const categoryCount: { [key: string]: number } = {};
    articles.forEach((article) => {
      const category = article.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const total = articles.length;
    const distribution = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category,
        count,
        percentage:
          total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
      }),
    );

    distribution.sort((a, b) => b.count - a.count);

    return { distribution, total };
  }

  async getTimeline(dateFrom?: string, dateTo?: string) {
    const queryBuilder =
      this.articleRepository.createQueryBuilder('article');

    if (dateFrom && dateTo) {
      queryBuilder.where('article.publishedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    } else if (dateFrom) {
      queryBuilder.where('article.publishedAt >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.where('article.publishedAt <= :dateTo', { dateTo });
    }

    const articles = await queryBuilder
      .select('article.publishedAt')
      .getMany();

    const dateCount: { [key: string]: number } = {};
    articles.forEach((article) => {
      const date = article.publishedAt.toISOString().split('T')[0];
      dateCount[date] = (dateCount[date] || 0) + 1;
    });

    const timeline = Object.entries(dateCount)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { timeline, total: articles.length };
  }

  async getTotalArticles(dateFrom?: string, dateTo?: string): Promise<number> {
    const queryBuilder =
      this.articleRepository.createQueryBuilder('article');

    if (dateFrom && dateTo) {
      queryBuilder.where('article.publishedAt BETWEEN :dateFrom AND :dateTo', {
        dateFrom,
        dateTo,
      });
    } else if (dateFrom) {
      queryBuilder.where('article.publishedAt >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.where('article.publishedAt <= :dateTo', { dateTo });
    }

    return await queryBuilder.getCount();
  }

  async getTopCategory() {
    const articles = await this.articleRepository.find({
      select: ['category'],
    });

    if (articles.length === 0) {
      return null;
    }

    const categoryCount: { [key: string]: number } = {};
    articles.forEach((article) => {
      const category = article.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const total = articles.length;
    const topEntry = Object.entries(categoryCount).sort(
      ([, a], [, b]) => b - a,
    )[0];

    if (!topEntry) {
      return null;
    }

    return {
      name: topEntry[0],
      count: topEntry[1],
      percentage:
        total > 0 ? parseFloat(((topEntry[1] / total) * 100).toFixed(1)) : 0,
    };
  }

  async getLatestArticle() {
    const articles = await this.articleRepository.find({
      select: ['id', 'title', 'category'],
      order: { publishedAt: 'DESC' },
      take: 1,
    });
    return articles[0] || null;
  }

  async getLastSyncTime() {
    const syncLogs = await this.syncLogRepository.find({
      select: ['startedAt'],
      order: { startedAt: 'DESC' },
      take: 1,
    });

    return syncLogs[0]?.startedAt || null;
  }
}

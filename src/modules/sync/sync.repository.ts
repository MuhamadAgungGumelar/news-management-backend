import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog } from './entities/sync-log.entity';
import { Article } from '../articles/entities/article.entity';

@Injectable()
export class SyncRepository {
  constructor(
    @InjectRepository(SyncLog)
    private readonly syncLogRepository: Repository<SyncLog>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createSyncLog(syncData: any): Promise<SyncLog> {
    const syncLog = this.syncLogRepository.create({
      syncedCount: syncData.syncedCount,
      updatedCount: syncData.updatedCount,
      skippedCount: syncData.skippedCount,
      status: syncData.status,
      errorMessage: syncData.errorMessage,
      startedAt: syncData.startedAt,
      completedAt: syncData.completedAt,
      durationMs: syncData.durationMs,
      triggeredBy: syncData.triggeredBy,
    });

    return await this.syncLogRepository.save(syncLog);
  }

  async getLastSync(): Promise<SyncLog | null> {
    return await this.syncLogRepository.findOne({
      where: {},
      order: { startedAt: 'DESC' },
      relations: ['triggerer'],
    });
  }

  async getSyncLogs(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.syncLogRepository
      .createQueryBuilder('syncLog')
      .leftJoinAndSelect('syncLog.triggerer', 'admin')
      .orderBy('syncLog.startedAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('syncLog.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async getTotalArticles(): Promise<number> {
    return await this.articleRepository.count();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import { Article } from '../articles/entities/article.entity';
import { SyncLog } from '../sync/entities/sync-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, SyncLog])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncRepository } from './sync.repository';
import { SyncLog } from './entities/sync-log.entity';
import { Article } from '../articles/entities/article.entity';
import { ArticlesModule } from '../articles/articles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SyncLog, Article]),
    ArticlesModule,
    AuthModule,
  ],
  controllers: [SyncController],
  providers: [SyncService, SyncRepository],
  exports: [SyncRepository],
})
export class SyncModule {}

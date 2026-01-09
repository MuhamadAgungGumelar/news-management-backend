import { ApiProperty } from '@nestjs/swagger';

export class SyncTriggeredByDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Super Admin' })
  name: string;
}

export class SyncResponseDto {
  @ApiProperty({ example: 45, description: 'Number of new articles synced' })
  syncedCount: number;

  @ApiProperty({ example: 5, description: 'Number of existing articles updated' })
  updatedCount: number;

  @ApiProperty({ example: 0, description: 'Number of articles skipped' })
  skippedCount: number;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  lastSyncAt: string;

  @ApiProperty({ example: 2500, description: 'Sync duration in milliseconds' })
  duration: number;

  @ApiProperty({ type: SyncTriggeredByDto })
  triggeredBy: SyncTriggeredByDto;
}

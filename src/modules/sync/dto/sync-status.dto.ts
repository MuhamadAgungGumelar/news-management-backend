import { ApiProperty } from '@nestjs/swagger';

export class LastTriggeredByDto {
  @ApiProperty({ example: 'Super Admin' })
  name: string;

  @ApiProperty({ example: 'admin@newsmanagement.com' })
  email: string;
}

export class SyncStatusDto {
  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  lastSyncAt: string;

  @ApiProperty({ example: 1250 })
  totalArticles: number;

  @ApiProperty({ example: false })
  isRunning: boolean;

  @ApiProperty({ example: true })
  canSyncNow: boolean;

  @ApiProperty({ example: null, required: false })
  nextAvailableSync: string | null;

  @ApiProperty({ example: 0 })
  cooldownRemaining: number;

  @ApiProperty({ type: LastTriggeredByDto, required: false })
  lastTriggeredBy?: LastTriggeredByDto;
}

import { ApiProperty } from '@nestjs/swagger';

export class TimelineItemDto {
  @ApiProperty({ example: '2026-01-01' })
  date: string;

  @ApiProperty({ example: 45 })
  count: number;
}

export class TimelineMetaDto {
  @ApiProperty({ example: '2026-01-01' })
  dateFrom: string;

  @ApiProperty({ example: '2026-01-08' })
  dateTo: string;

  @ApiProperty({ example: 377 })
  totalArticles: number;

  @ApiProperty({ example: 47.1 })
  averagePerDay: number;
}

export class TimelineDto {
  @ApiProperty({ type: [TimelineItemDto] })
  data: TimelineItemDto[];

  @ApiProperty({ type: TimelineMetaDto })
  meta: TimelineMetaDto;
}

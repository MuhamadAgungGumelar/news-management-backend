import { ApiProperty } from '@nestjs/swagger';

export class TopCategoryDto {
  @ApiProperty({ example: 'technology' })
  name: string;

  @ApiProperty({ example: 450 })
  count: number;

  @ApiProperty({ example: 35.5 })
  percentage: number;
}

export class LatestArticleDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Breaking News: Latest Development' })
  title: string;

  @ApiProperty({ example: 'technology' })
  category: string;
}

export class DateRangeInfoDto {
  @ApiProperty({ example: '2025-12-01' })
  from: string;

  @ApiProperty({ example: '2026-01-08' })
  to: string;
}

export class SummaryDto {
  @ApiProperty({ example: 1270 })
  totalArticles: number;

  @ApiProperty({ type: TopCategoryDto })
  topCategory: TopCategoryDto;

  @ApiProperty({ type: LatestArticleDto })
  latestArticle: LatestArticleDto;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  lastSyncAt: string;

  @ApiProperty({ type: DateRangeInfoDto })
  dateRange: DateRangeInfoDto;
}

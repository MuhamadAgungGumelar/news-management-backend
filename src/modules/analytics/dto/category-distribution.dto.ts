import { ApiProperty } from '@nestjs/swagger';

export class CategoryDistributionItemDto {
  @ApiProperty({ example: 'technology' })
  category: string;

  @ApiProperty({ example: 450 })
  count: number;

  @ApiProperty({ example: 35.5 })
  percentage: number;
}

export class CategoryDistributionMetaDto {
  @ApiProperty({ example: '2025-12-01' })
  dateFrom: string;

  @ApiProperty({ example: '2026-01-08' })
  dateTo: string;

  @ApiProperty({ example: 1270 })
  totalArticles: number;
}

export class CategoryDistributionDto {
  @ApiProperty({ type: [CategoryDistributionItemDto] })
  data: CategoryDistributionItemDto[];

  @ApiProperty({ type: CategoryDistributionMetaDto })
  meta: CategoryDistributionMetaDto;
}

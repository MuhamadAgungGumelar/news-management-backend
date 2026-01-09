import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class DateRangeDto {
  @ApiProperty({
    description: 'Filter from date (YYYY-MM-DD)',
    example: '2026-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateFrom must be in format YYYY-MM-DD',
  })
  dateFrom?: string;

  @ApiProperty({
    description: 'Filter to date (YYYY-MM-DD)',
    example: '2026-01-08',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateTo must be in format YYYY-MM-DD',
  })
  dateTo?: string;
}

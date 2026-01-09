import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SyncRequestDto {
  @ApiProperty({
    description: 'Categories to sync',
    example: ['technology', 'business'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Country code',
    example: 'us',
    default: 'us',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Number of articles to fetch per category',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}

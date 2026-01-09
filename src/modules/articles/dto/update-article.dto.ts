import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
  IsIn,
  IsDateString,
} from 'class-validator';
import { VALID_CATEGORIES } from '../../../common/constants/categories.constant';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'Updated Title',
    minLength: 5,
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title?: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Updated description...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Full article content',
    example: 'Updated content...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Article URL',
    example: 'https://example.com/updated-article',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  url?: string;

  @ApiProperty({
    description: 'Article image URL',
    example: 'https://example.com/images/updated.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  imageUrl?: string;

  @ApiProperty({
    description: 'Article source',
    example: 'Updated Source',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Source must not exceed 100 characters' })
  source?: string;

  @ApiProperty({
    description: 'Article author',
    example: 'Jane Doe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Author must not exceed 255 characters' })
  author?: string;

  @ApiProperty({
    description: 'Article category',
    example: 'business',
    enum: VALID_CATEGORIES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(VALID_CATEGORIES, { message: 'Invalid category' })
  category?: string;

  @ApiProperty({
    description: 'Article published date (ISO format)',
    example: '2026-01-08T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid ISO date string' })
  publishedAt?: string;
}

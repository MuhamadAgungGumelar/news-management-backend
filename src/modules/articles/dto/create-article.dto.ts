import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
  IsDateString,
} from 'class-validator';
import { VALID_CATEGORIES } from '../../../common/constants/categories.constant';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'Breaking: New Tech Innovation',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Article description',
    example: 'This is a brief description of the article...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Full article content',
    example: 'Full article content here...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Article URL',
    example: 'https://example.com/article/tech-innovation',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url: string;

  @ApiProperty({
    description: 'Article image URL',
    example: 'https://example.com/images/tech.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  imageUrl?: string;

  @ApiProperty({
    description: 'Article source',
    example: 'TechCrunch',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Source must not exceed 100 characters' })
  source?: string;

  @ApiProperty({
    description: 'Article author',
    example: 'John Doe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Author must not exceed 255 characters' })
  author?: string;

  @ApiProperty({
    description: 'Article category',
    example: 'technology',
    enum: VALID_CATEGORIES,
  })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @IsIn(VALID_CATEGORIES, { message: 'Invalid category' })
  category: string;

  @ApiProperty({
    description: 'Article published date (ISO format)',
    example: '2026-01-08T10:00:00.000Z',
  })
  @IsDateString({}, { message: 'Please provide a valid ISO date string' })
  @IsNotEmpty({ message: 'Published date is required' })
  publishedAt: string;
}

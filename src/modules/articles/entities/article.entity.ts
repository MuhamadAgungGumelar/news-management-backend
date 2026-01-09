import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admins/entities/admin.entity';

@Entity('articles')
export class Article {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'newsapi_tech_12345' })
  @Column({ name: 'api_id', unique: true, length: 255 })
  @Index()
  apiId: string;

  @ApiProperty({ example: 'AI Revolution in 2026' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({
    example: 'How artificial intelligence is transforming industries...',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'Full article content here...' })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({ example: 'https://example.com/article/ai-revolution' })
  @Column({ type: 'text' })
  url: string;

  @ApiProperty({ example: 'https://example.com/images/ai.jpg' })
  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @ApiProperty({ example: 'TechCrunch' })
  @Column({ length: 100, nullable: true })
  source: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ length: 255, nullable: true })
  author: string;

  @ApiProperty({ example: 'technology' })
  @Column({ length: 50 })
  @Index()
  category: string;

  @ApiProperty({ example: '2026-01-08T09:00:00.000Z' })
  @Column({ name: 'published_at', type: 'timestamp' })
  @Index()
  publishedAt: Date;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z', required: false })
  @Column({ name: 'last_synced_at', type: 'timestamp', nullable: true })
  lastSyncedAt?: Date;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  @Index()
  updatedAt: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  @Index()
  createdBy?: string;

  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator?: Admin;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updater?: Admin;
}

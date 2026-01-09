import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admins/entities/admin.entity';

@Entity('sync_logs')
export class SyncLog {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 45 })
  @Column({ name: 'synced_count', type: 'int', default: 0 })
  syncedCount: number;

  @ApiProperty({ example: 5 })
  @Column({ name: 'updated_count', type: 'int', default: 0 })
  updatedCount: number;

  @ApiProperty({ example: 0 })
  @Column({ name: 'skipped_count', type: 'int', default: 0 })
  skippedCount: number;

  @ApiProperty({ example: 'success' })
  @Column({ length: 20 })
  @Index()
  status: string;

  @ApiProperty({ example: null, required: false })
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  @CreateDateColumn({ name: 'started_at' })
  @Index()
  startedAt: Date;

  @ApiProperty({ example: '2026-01-08T10:30:02.500Z', required: false })
  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ example: 2500, required: false })
  @Column({ name: 'duration_ms', type: 'int', nullable: true })
  durationMs?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ name: 'triggered_by', type: 'uuid', nullable: true })
  @Index()
  triggeredBy?: string;

  @ManyToOne(() => Admin, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'triggered_by' })
  triggerer?: Admin;
}

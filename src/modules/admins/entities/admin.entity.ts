import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('admins')
export class Admin {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'admin@newsmanagement.com' })
  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ length: 255 })
  password: string;

  @ApiProperty({ example: 'Super Admin' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'super_admin' })
  @Column({ length: 50, default: 'admin' })
  role: string;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  @Index()
  isActive: boolean;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z', required: false })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

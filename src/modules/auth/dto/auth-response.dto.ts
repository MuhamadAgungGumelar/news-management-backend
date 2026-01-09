import { ApiProperty } from '@nestjs/swagger';

export class AdminInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'admin@newsmanagement.com' })
  email: string;

  @ApiProperty({ example: 'Super Admin' })
  name: string;

  @ApiProperty({ example: 'super_admin' })
  role: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z', required: false })
  lastLoginAt?: string;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-08T10:30:00.000Z' })
  updatedAt: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: 86400, description: 'Token expiration time in seconds' })
  expiresIn: number;

  @ApiProperty({ type: AdminInfoDto })
  admin: AdminInfoDto;
}

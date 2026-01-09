import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { VALID_ROLES } from '../../../common/constants/roles.constant';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Admin name',
    example: 'John Editor Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Admin role',
    example: 'admin',
    enum: VALID_ROLES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(VALID_ROLES, { message: 'Invalid role' })
  role?: string;

  @ApiProperty({
    description: 'Is admin active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

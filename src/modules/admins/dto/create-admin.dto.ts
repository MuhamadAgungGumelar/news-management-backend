import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { VALID_ROLES } from '../../../common/constants/roles.constant';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'editor@newsmanagement.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'Editor123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Admin name',
    example: 'John Editor',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Admin role',
    example: 'editor',
    enum: VALID_ROLES,
    default: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(VALID_ROLES, { message: 'Invalid role' })
  role?: string;

  @ApiProperty({
    description: 'Is admin active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

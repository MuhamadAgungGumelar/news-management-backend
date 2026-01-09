import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryAdminDto } from './dto/query-admin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminRole } from '../../common/constants/roles.constant';

@ApiTags('admins')
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get list of all admins (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
    type: [Admin],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Super Admin only',
  })
  async findAll(@Query() queryDto: QueryAdminDto) {
    return {
      success: true,
      ...(await this.adminsService.findAll(queryDto)),
    };
  }

  @Get(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin by ID (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admin retrieved successfully',
    type: Admin,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.adminsService.findOne(id),
    };
  }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new admin (Super Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: Admin,
  })
  @ApiResponse({
    status: 409,
    description: 'Admin with this email already exists',
  })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return {
      success: true,
      message: 'Admin created successfully',
      data: await this.adminsService.create(createAdminDto),
    };
  }

  @Put(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update admin details (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
    type: Admin,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return {
      success: true,
      message: 'Admin updated successfully',
      data: await this.adminsService.update(id, updateAdminDto),
    };
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete admin (Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admin deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete your own account',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return {
      success: true,
      ...(await this.adminsService.delete(id, user.id)),
    };
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
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
  ApiQuery,
} from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncRequestDto } from './dto/sync-request.dto';
import { SyncResponseDto } from './dto/sync-response.dto';
import { SyncStatusDto } from './dto/sync-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AdminRole } from '../../common/constants/roles.constant';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Fetch latest articles from News API and sync to database',
  })
  @ApiResponse({
    status: 200,
    description: 'Sync completed successfully',
    type: SyncResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Sync cooldown active or sync already running',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Super Admin only',
  })
  async syncArticles(
    @Body() syncRequestDto: SyncRequestDto,
    @CurrentUser() user: any,
  ) {
    return {
      success: true,
      message: 'Sync completed successfully',
      data: await this.syncService.syncArticles(syncRequestDto, user.id),
    };
  }

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get current sync status and last sync information' })
  @ApiResponse({
    status: 200,
    description: 'Sync status retrieved successfully',
    type: SyncStatusDto,
  })
  async getSyncStatus() {
    return {
      success: true,
      data: await this.syncService.getSyncStatus(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('logs')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get sync history logs' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['success', 'partial', 'failed'],
  })
  @ApiResponse({
    status: 200,
    description: 'Sync logs retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Super Admin only',
  })
  async getSyncLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return {
      success: true,
      ...(await this.syncService.getSyncLogs(page, limit, status)),
    };
  }
}

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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AdminRole } from '../../common/constants/roles.constant';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get paginated list of articles with filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: [Article],
  })
  async findAll(@Query() queryDto: QueryArticleDto) {
    return {
      success: true,
      ...(await this.articlesService.findAll(queryDto)),
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single article by ID' })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully',
    type: Article,
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found',
  })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.articlesService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.EDITOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new article manually' })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully',
    type: Article,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: any,
  ) {
    return {
      success: true,
      message: 'Article created successfully',
      data: await this.articlesService.create(createArticleDto, user.id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update existing article' })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully',
    type: Article,
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser() user: any,
  ) {
    return {
      success: true,
      message: 'Article updated successfully',
      data: await this.articlesService.update(id, updateArticleDto, user.id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete article by ID' })
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found',
  })
  async delete(@Param('id') id: string) {
    return {
      success: true,
      ...(await this.articlesService.delete(id)),
    };
  }
}

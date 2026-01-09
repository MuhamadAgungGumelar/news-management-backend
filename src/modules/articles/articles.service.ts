import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import * as crypto from 'crypto';

@Injectable()
export class ArticlesService {
  constructor(private articlesRepository: ArticlesRepository) {}

  async findAll(queryDto: QueryArticleDto) {
    const { data, total } = await this.articlesRepository.findAll(queryDto);
    const { page = 1, limit = 10 } = queryDto;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const article = await this.articlesRepository.findOne(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto, userId?: string) {
    const apiId = this.generateManualApiId();

    const articleData = {
      apiId,
      title: createArticleDto.title,
      description: createArticleDto.description,
      content: createArticleDto.content,
      url: createArticleDto.url,
      imageUrl: createArticleDto.imageUrl,
      source: createArticleDto.source,
      author: createArticleDto.author,
      category: createArticleDto.category,
      publishedAt: createArticleDto.publishedAt,
    };

    const article = await this.articlesRepository.create(articleData, userId);
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto, userId?: string) {
    const article = await this.articlesRepository.findOne(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const updatedArticle = await this.articlesRepository.update(
      id,
      updateArticleDto,
      userId,
    );
    return updatedArticle;
  }

  async delete(id: string) {
    const article = await this.articlesRepository.findOne(id);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.articlesRepository.delete(id);

    return {
      message: 'Article deleted successfully',
    };
  }

  private generateManualApiId(): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    return `manual_${timestamp}_${randomString}`;
  }
}

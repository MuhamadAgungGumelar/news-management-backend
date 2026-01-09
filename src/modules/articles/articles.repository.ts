import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { QueryArticleDto } from './dto/query-article.dto';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(queryDto: QueryArticleDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      source,
      author,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
      dateFrom,
      dateTo,
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (search) {
      queryBuilder.where(
        '(article.title ILIKE :search OR article.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('article.category = :category', { category });
    }

    if (source) {
      queryBuilder.andWhere('article.source = :source', { source });
    }

    if (author) {
      queryBuilder.andWhere('article.author ILIKE :author', {
        author: `%${author}%`,
      });
    }

    if (dateFrom && dateTo) {
      queryBuilder.andWhere(
        'article.publishedAt BETWEEN :dateFrom AND :dateTo',
        {
          dateFrom,
          dateTo,
        },
      );
    } else if (dateFrom) {
      queryBuilder.andWhere('article.publishedAt >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.andWhere('article.publishedAt <= :dateTo', { dateTo });
    }

    const orderColumn = sortBy === 'updated_at' ? 'updatedAt' : sortBy;
    queryBuilder.orderBy(
      `article.${orderColumn}`,
      sortOrder === 'ASC' ? 'ASC' : 'DESC',
    );

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Article | null> {
    return await this.articleRepository.findOne({ where: { id } });
  }

  async findByApiId(apiId: string): Promise<Article | null> {
    return await this.articleRepository.findOne({ where: { apiId } });
  }

  async create(articleData: any, userId?: string): Promise<Article> {
    const article = this.articleRepository.create({
      apiId: articleData.apiId,
      title: articleData.title,
      description: articleData.description,
      content: articleData.content,
      url: articleData.url,
      imageUrl: articleData.imageUrl,
      source: articleData.source,
      author: articleData.author,
      category: articleData.category,
      publishedAt: articleData.publishedAt,
      lastSyncedAt: articleData.lastSyncedAt,
      createdBy: userId,
    });

    return await this.articleRepository.save(article);
  }

  async update(
    id: string,
    articleData: any,
    userId?: string,
  ): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) {
      throw new Error('Article not found');
    }

    if (articleData.title !== undefined) article.title = articleData.title;
    if (articleData.description !== undefined)
      article.description = articleData.description;
    if (articleData.content !== undefined)
      article.content = articleData.content;
    if (articleData.url !== undefined) article.url = articleData.url;
    if (articleData.imageUrl !== undefined)
      article.imageUrl = articleData.imageUrl;
    if (articleData.source !== undefined) article.source = articleData.source;
    if (articleData.author !== undefined) article.author = articleData.author;
    if (articleData.category !== undefined)
      article.category = articleData.category;
    if (articleData.publishedAt !== undefined)
      article.publishedAt = articleData.publishedAt;
    if (articleData.lastSyncedAt !== undefined)
      article.lastSyncedAt = articleData.lastSyncedAt;

    article.updatedBy = userId;

    return await this.articleRepository.save(article);
  }

  async upsertByApiId(articleData: any): Promise<Article> {
    const existingArticle = await this.findByApiId(articleData.apiId);

    if (existingArticle) {
      return await this.update(existingArticle.id, {
        ...articleData,
        lastSyncedAt: new Date(),
      });
    } else {
      return await this.create({
        ...articleData,
        lastSyncedAt: new Date(),
      });
    }
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.articleRepository.delete(id);
    return { success: true };
  }
}

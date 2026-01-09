import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('News Management API')
  .setDescription('API for managing news articles with admin authentication')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentication endpoints')
  .addTag('admins', 'Admin management')
  .addTag('health', 'Health check endpoints')
  .addTag('sync', 'Sync operations with News API')
  .addTag('articles', 'CRUD operations for articles')
  .addTag('analytics', 'Analytics and reporting')
  .build();

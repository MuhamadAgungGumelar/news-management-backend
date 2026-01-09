import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    // Force IPv4 connection (fix Railway IPv6 issue)
    family: 4,
    // Connection pool settings for production
    max: Number.parseInt(process.env.DATABASE_POOL_MAX || '10'),
    min: Number.parseInt(process.env.DATABASE_POOL_MIN || '2'),
    // Connection timeout
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;

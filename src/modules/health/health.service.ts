import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async checkHealth() {
    const startTime = Date.now();
    let databaseStatus = 'disconnected';

    try {
      // Simple query to check database connection
      await this.dataSource.query('SELECT 1');
      databaseStatus = 'connected';
    } catch (error) {
      databaseStatus = 'disconnected';
    }

    const uptime = process.uptime();

    if (databaseStatus === 'disconnected') {
      throw new ServiceUnavailableException({
        success: false,
        data: {
          status: 'degraded',
          database: databaseStatus,
          timestamp: new Date().toISOString(),
          uptime: Math.floor(uptime),
        },
      });
    }

    return {
      success: true,
      data: {
        status: 'ok',
        database: databaseStatus,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        responseTime: Date.now() - startTime,
      },
    };
  }
}

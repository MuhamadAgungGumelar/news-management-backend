import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { DateRangeDto } from './dto/date-range.dto';

@Injectable()
export class AnalyticsService {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async getCategoryDistribution(dateRangeDto: DateRangeDto) {
    const dateFrom =
      dateRangeDto.dateFrom ||
      this.getDateDaysAgo(30);
    const dateTo = dateRangeDto.dateTo || this.getTodayDate();

    const { distribution, total } =
      await this.analyticsRepository.getCategoryDistribution(dateFrom, dateTo);

    return {
      data: distribution,
      meta: {
        dateFrom,
        dateTo,
        totalArticles: total,
      },
    };
  }

  async getTimeline(dateRangeDto: DateRangeDto) {
    const dateFrom =
      dateRangeDto.dateFrom ||
      this.getDateDaysAgo(30);
    const dateTo = dateRangeDto.dateTo || this.getTodayDate();

    const { timeline, total } = await this.analyticsRepository.getTimeline(
      dateFrom,
      dateTo,
    );

    const daysDiff = this.getDaysDifference(dateFrom, dateTo) || 1;
    const averagePerDay = total > 0 ? parseFloat((total / daysDiff).toFixed(1)) : 0;

    return {
      data: timeline,
      meta: {
        dateFrom,
        dateTo,
        totalArticles: total,
        averagePerDay,
      },
    };
  }

  async getSummary() {
    const totalArticles = await this.analyticsRepository.getTotalArticles();
    const topCategory = await this.analyticsRepository.getTopCategory();
    const latestArticle = await this.analyticsRepository.getLatestArticle();
    const lastSyncAt = await this.analyticsRepository.getLastSyncTime();

    const dateFrom = this.getDateDaysAgo(30);
    const dateTo = this.getTodayDate();

    return {
      totalArticles,
      topCategory: topCategory || {
        name: 'N/A',
        count: 0,
        percentage: 0,
      },
      latestArticle: latestArticle || {
        id: null,
        title: 'No articles yet',
        category: 'N/A',
      },
      lastSyncAt: lastSyncAt || null,
      dateRange: {
        from: dateFrom,
        to: dateTo,
      },
    };
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDaysDifference(dateFrom: string, dateTo: string): number {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to.getTime() - from.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }
}

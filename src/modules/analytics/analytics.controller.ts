import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { DateRangeDto } from './dto/date-range.dto';
import { CategoryDistributionDto } from './dto/category-distribution.dto';
import { TimelineDto } from './dto/timeline.dto';
import { SummaryDto } from './dto/summary.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('analytics')
@Controller('analytics')
@Public()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('category-distribution')
  @ApiOperation({ summary: 'Get article count per category for Pie Chart' })
  @ApiResponse({
    status: 200,
    description: 'Category distribution retrieved successfully',
    type: CategoryDistributionDto,
  })
  async getCategoryDistribution(@Query() dateRangeDto: DateRangeDto) {
    return {
      success: true,
      ...(await this.analyticsService.getCategoryDistribution(dateRangeDto)),
    };
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get article count per date for Column Chart' })
  @ApiResponse({
    status: 200,
    description: 'Timeline retrieved successfully',
    type: TimelineDto,
  })
  async getTimeline(@Query() dateRangeDto: DateRangeDto) {
    return {
      success: true,
      ...(await this.analyticsService.getTimeline(dateRangeDto)),
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics for dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Summary statistics retrieved successfully',
    type: SummaryDto,
  })
  async getSummary() {
    return {
      success: true,
      data: await this.analyticsService.getSummary(),
    };
  }
}

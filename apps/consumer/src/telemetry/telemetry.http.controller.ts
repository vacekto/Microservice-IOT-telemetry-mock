import { Controller, Get, Query } from '@nestjs/common';
import { GetTelemetryLatestDto } from '../Dtos/getTelemetryLatestDto';
import { GetTelemetryRamgeDto } from '../Dtos/getTelemetryRangeDto';
import { RedisService } from './redis.service';

@Controller('telemetry')
export class TelemetryHttpController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  getTelemetryRange(@Query() params: GetTelemetryRamgeDto) {
    return this.redisService.getTelemetryRange(params);
  }

  @Get('latest')
  getTelemetryLatest(@Query() params: GetTelemetryLatestDto) {
    return this.redisService.getTelemetryLatest(params);
  }

  @Get('devices')
  getDevices() {
    return this.redisService.getAllDeviceKeys();
  }
}

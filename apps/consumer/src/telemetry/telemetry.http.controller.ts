import { TelemetryData } from '@app/shared';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RedisService } from '../Redis/redis.service';
import { GetTelemetryLatestDto } from './Dtos/getTelemetryLatestDto';
import { GetTelemetryRamgeDto } from './Dtos/getTelemetryRangeDto';

@Controller('telemetry')
export class TelemetryHttpController {
  constructor(private readonly redisService: RedisService) {}

  @Get('range')
  @ApiOperation({
    summary: 'Get telemetry data for a device in specified range',
  })
  @ApiResponse({
    status: 200,
    description: 'List of telemetry data in request range',
    type: [TelemetryData],
  })
  getTelemetryRange(@Query() params: GetTelemetryRamgeDto) {
    const start = Date.parse(params.from);
    const end = Date.parse(params.to);

    return this.redisService.getTelemetryRange({
      deviceId: params.deviceId,
      count: params.count,
      start,
      end,
    });
  }

  @Get('latest')
  @ApiOperation({
    summary:
      'Get latest telemetry for a device, sorted in descending order from latest measurement',
  })
  @ApiResponse({
    status: 200,
    description: 'List of lastest telemetry data',
    type: [TelemetryData],
  })
  getTelemetryLatest(@Query() params: GetTelemetryLatestDto) {
    return this.redisService.getTelemetryLatest(params);
  }

  @Get('devices')
  @ApiOperation({
    summary: 'Get list of device ids sending telemetry data',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of strings',
    type: String,
    isArray: true,
  })
  getDevices() {
    return this.redisService.getAllDeviceKeys();
  }
}

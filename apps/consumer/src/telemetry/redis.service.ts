import { TOKENS } from '@app/shared/tokents';
import { TelemetryData } from '@app/shared/types';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { GetTelemetryLatestDto } from '../Dtos/getTelemetryLatestDto';
import { GetTelemetryRamgeDto } from '../Dtos/getTelemetryRangeDto';

/**
 * Redis instance interface for storing telemetry data, stored in ZSET
 * ZSET key == telemetry:${deviceId}
 * ZSET score == timestamp,
 * ZSET value == JSON(data)
 *
 */

@Injectable()
export class RedisService {
  private readonly zsetKey = 'telemetry';

  constructor(@Inject(TOKENS.REDIS) private readonly client: Redis) {}

  async saveTelemetry(data: TelemetryData) {
    await this.client.zadd(
      `${this.zsetKey}:${data.deviceId}`,
      data.timestamp,
      JSON.stringify(data),
    );
  }

  /**
   * Retrieve all data in a timestamp range
   * start and end are Unix timestamps (ms)
   */

  async getTelemetryRange({
    from,
    to,
    deviceId,
    count,
  }: GetTelemetryRamgeDto): Promise<TelemetryData[]> {
    const start = from ? Date.parse(from) : '-inf';
    const end = to ? Date.parse(to) : '+inf';
    count = count ? count : 200;

    console.log('request data:', start, end, deviceId);

    const key = `${this.zsetKey}:${deviceId}`;
    const data = await this.client.zrangebyscore(
      key,
      start,
      end,
      'LIMIT',
      0,
      count ? count : 200,
    );

    const results: TelemetryData[] = [];

    for (const item of data) {
      results.push(JSON.parse(item) as TelemetryData);
    }

    return results;
  }

  async getTelemetryLatest({ deviceId, count }: GetTelemetryLatestDto) {
    count = count ? count : 30;
    const key = `${this.zsetKey}:${deviceId}`;
    const data = await this.client.zrange(key, 0, count - 1);

    const results: TelemetryData[] = [];

    for (const item of data) {
      results.push(JSON.parse(item) as TelemetryData);
    }

    return results;
  }

  async getAllDeviceKeys(): Promise<string[]> {
    const keys = await this.client.keys(`${this.zsetKey}:*`);
    const length = `${this.zsetKey}:`.length;
    const sliced = keys.map((k) => k.slice(length));
    return sliced;
  }
}

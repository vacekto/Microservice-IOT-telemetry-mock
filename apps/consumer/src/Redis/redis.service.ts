import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TOKENS } from 'libs/shared/util/nestjs.tokents';
import { TelemetryData } from 'libs/shared/util/types';
import { GetTelemetryLatestDto } from '../telemetry/Dtos/getTelemetryLatestDto';

export interface GetTelemetryRangeProps {
  start: number;
  end: number;
  deviceId: string;
  count?: number;
}

/**
 * Redis instance interface for storing telemetry data, stored in ZSET
 * ZSET key == ${RedisService.zsetKey}:${deviceId}
 * ZSET score == timestamp,
 * ZSET value == JSON(data)
 */

@Injectable()
export class RedisService {
  readonly zsetKey = 'telemetry';

  constructor(@Inject(TOKENS.REDIS) private readonly client: Redis) {}

  async saveTelemetry(data: TelemetryData) {
    await this.client.zadd(
      `${this.zsetKey}:${data.deviceId}`,
      data.timestamp,
      JSON.stringify(data),
    );
  }

  /**
   * Retrieve all data from a time range in ascending order
   * @param {number} start in Unix timestamps (ms)
   * @param {number} end in Unix timestamps (ms)
   */

  async getTelemetryRange({
    start,
    end,
    deviceId,
    count,
  }: GetTelemetryRangeProps): Promise<TelemetryData[]> {
    count = count ? count : 50;

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

  /**
   * @param {number} [params.count=30] - The number of latest measurements to return.
   * @returns {Promise<TelemetryData[]>} A list of the most recent telemetry records in descending order.
   */
  async getTelemetryLatest({ deviceId, count }: GetTelemetryLatestDto) {
    count = count ? count : 30;
    const key = `${this.zsetKey}:${deviceId}`;
    const data = await this.client.zrevrange(key, 0, count - 1);

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

  async close() {
    await this.client.quit();
  }

  async flush() {
    await this.client.flushdb();
  }
}

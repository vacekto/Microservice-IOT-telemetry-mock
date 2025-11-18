import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TOKENS } from 'libs/shared';
import { TelemetryDataDTO } from 'libs/shared/util/DTO/telemetryData';
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
  static readonly zsetKey = 'telemetry';

  constructor(@Inject(TOKENS.REDIS) private readonly client: Redis) {}

  async saveTelemetry(data: TelemetryDataDTO) {
    const json = JSON.stringify(data);

    await this.client.zadd(
      `${RedisService.zsetKey}:${data.deviceId}`,
      data.timestamp,
      json,
    );
  }

  /**
   * Retrieves all data for specific device from a time range in ascending order
   * @param {number} start in Unix timestamps (ms)
   * @param {number} end in Unix timestamps (ms)
   * @param {string} deviceId id (uuid) of the device
   * @param {number} count number of items to return, default == 50, max value == 100
   */

  async getTelemetryRange({
    start,
    end,
    deviceId,
    count = 50,
  }: GetTelemetryRangeProps): Promise<TelemetryDataDTO[]> {
    count = count > 100 ? 100 : count;

    const key = `${RedisService.zsetKey}:${deviceId}`;
    const offset = 0;

    const data = await this.client.zrangebyscore(
      key,
      start,
      end,
      'LIMIT',
      offset,
      count,
    );

    const results: TelemetryDataDTO[] = [];

    for (const item of data) {
      results.push(JSON.parse(item) as TelemetryDataDTO);
    }

    return results;
  }

  /**
   * Retrieves latest data for specific device from a time range in descending order
   * @param {string} deviceId id (uuid) of the device
   * @param {number} count - The number of latest measurements to return, default == 50 and max == 100.
   */
  async getTelemetryLatest({
    deviceId,
    count = 30,
  }: GetTelemetryLatestDto): Promise<TelemetryDataDTO[]> {
    count = count > 100 ? 100 : count;

    const key = `${RedisService.zsetKey}:${deviceId}`;

    const data = await this.client.zrevrange(key, 0, count - 1);

    const results: TelemetryDataDTO[] = [];

    for (const item of data) {
      results.push(JSON.parse(item) as TelemetryDataDTO);
    }

    return results;
  }

  /**
   * Fetches list of device ids with persested telemetry data
   */
  async getAllDeviceKeys(): Promise<string[]> {
    const keys = await this.client.keys(`${RedisService.zsetKey}:*`);
    const length = `${RedisService.zsetKey}:`.length;
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

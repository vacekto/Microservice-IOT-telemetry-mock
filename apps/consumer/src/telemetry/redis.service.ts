import { TelemetryPayload } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Redis instance interface for storing telemetry data, stored in ZSET
 * ZSET key == telemetry:${deviceId}
 * ZSET score == timestamp,
 * ZSET value == JSON(payload)
 *
 */
@Injectable()
export class RedisService {
  private readonly zsetKey = 'telemetry';

  constructor(@Inject(TOKENS.REDIS) private readonly client: Redis) {}

  async saveTelemetry(payload: TelemetryPayload) {
    await this.client.zadd(
      this.zsetKey,
      payload.timestamp,
      JSON.stringify(payload),
    );
  }

  /**
   * Retrieve all payloads in a timestamp range
   * start and end are Unix timestamps (ms)
   */
  async getTelemetryByTimeRange(
    start: number | '-inf',
    end: number | 'inf',
  ): Promise<TelemetryPayload[]> {
    const data = await this.client.zrangebyscore(this.zsetKey, start, end);
    return data.map((p) => JSON.parse(p) as TelemetryPayload);
  }
}

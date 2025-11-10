import { TOKENS } from '@app/shared/tokents';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './telemetry/redis.service';
import { TelemetryHttpController } from './telemetry/telemetry.http.controller';
import { TelemetryRMQController } from './telemetry/telemetry.rmq.controller';

@Module({
  imports: [],
  controllers: [TelemetryRMQController, TelemetryHttpController],
  providers: [
    {
      provide: TOKENS.REDIS,
      useFactory: () => new Redis({ host: 'redis', port: 6379 }),
    },
    RedisService,
  ],
})
export class ConsumerModule {}

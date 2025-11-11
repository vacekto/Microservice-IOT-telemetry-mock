import { TOKENS } from '@app/shared';
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
      useFactory: () =>
        new Redis({
          host: process.env.REDIS_HOST as string,
          port: Number(process.env.REDIS_PORT),
        }),
    },
    RedisService,
  ],
})
export class ConsumerModule {}

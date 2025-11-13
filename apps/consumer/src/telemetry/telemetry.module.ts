import { Module } from '@nestjs/common';
import { RedisModule } from '../Redis/redis.module';
import { TelemetryHttpController } from './telemetry.http.controller';
import { TelemetryRMQController } from './telemetry.rmq.controller';

@Module({
  imports: [RedisModule],
  controllers: [TelemetryRMQController, TelemetryHttpController],
  providers: [
    // {
    //   provide: TOKENS.REDIS,
    //   useFactory: () =>
    //     new Redis({
    //       host: process.env.REDIS_HOST as string,
    //       port: Number(process.env.REDIS_PORT),
    //     }),
    // },
    // RedisService,
  ],
})
export class TelemetryModule {}

import { Module } from '@nestjs/common';
import { RedisModule } from '../Redis/redis.module';
import { TelemetryHttpController } from './telemetry.http.controller';
import { TelemetryRMQController } from './telemetry.rmq.controller';

@Module({
  imports: [RedisModule],
  controllers: [TelemetryRMQController, TelemetryHttpController],
  providers: [],
})
export class TelemetryModule {}

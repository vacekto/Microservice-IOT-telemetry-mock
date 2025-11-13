import { Module } from '@nestjs/common';
import { RedisModule } from './Redis/redis.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [TelemetryModule, RedisModule],
})
export class ConsumerModule {}

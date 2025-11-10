import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { TelemetryController } from './telemetry/telemetry.controller';

@Module({
  imports: [],
  controllers: [ConsumerController, TelemetryController],
  providers: [],
})
export class ConsumerModule {}

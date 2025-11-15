import { RMQ_EVENTS, TelemetryData } from '@app/shared';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisService } from '../Redis/redis.service';

@Controller()
export class TelemetryRMQController {
  private readonly logger = new Logger(TelemetryRMQController.name);

  constructor(private readonly redisService: RedisService) {}

  @MessagePattern(RMQ_EVENTS.NEW_TELEMETRY)
  async handleTelemetry(@Payload() data: TelemetryData) {
    await this.redisService.saveTelemetry(data);
    this.logger.debug(`Received telemetry: ${JSON.stringify(data)}`);
  }
}

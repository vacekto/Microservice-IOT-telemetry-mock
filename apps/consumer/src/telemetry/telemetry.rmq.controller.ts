import { EVENTS, TelemetryPayload } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisService } from './redis.service';

@Controller('telemetry')
export class TelemetryRMQController {
  constructor(private readonly redisService: RedisService) {}

  @MessagePattern(EVENTS.NEW_TELEMETRY)
  async handleTelemetry(@Payload() data: TelemetryPayload) {
    await this.redisService.saveTelemetry(data);
    console.log('data:', data);
  }
}

import { EVENTS, TelemetryPayload } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('telemetry')
export class TelemetryController {
  @MessagePattern(EVENTS.HELLO)
  handleHello(@Payload() data: TelemetryPayload) {
    console.log('new telemetry received:', data);
  }
}

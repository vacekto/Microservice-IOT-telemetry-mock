import { EVENTS } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  @MessagePattern(EVENTS.HELLO)
  handleHello(@Payload() data: string) {
    console.log('Received in service:', data);
  }
}

import { EVENTS } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService implements OnModuleInit {
  constructor(@Inject(TOKENS.RMQ) private readonly rmq: ClientProxy) {}

  onModuleInit() {
    this.emitHello();
  }

  emitHello() {
    this.rmq.emit(EVENTS.HELLO, 'hello');
  }
}

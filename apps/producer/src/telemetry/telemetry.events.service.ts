import { RMQ_EVENTS, TelemetryData } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { EMMITER2_EVENTS } from '../util/Emmiter2Events';

@Injectable()
export class TelemetryTransportService {
  constructor(@Inject(TOKENS.RMQ) private readonly rmq: ClientProxy) {}

  @OnEvent(EMMITER2_EVENTS.NEW_TELEMETRY)
  handleTelemetry(data: TelemetryData) {
    this.rmq.emit(RMQ_EVENTS.NEW_TELEMETRY, data);
  }
}

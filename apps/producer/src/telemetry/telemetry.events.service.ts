import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_EVENTS, TelemetryData } from 'libs/shared';
import { TOKENS } from 'libs/shared/util/nestjs.tokents';
import { EMMITER_EVENTS } from '../util/EmmiterEvents';

@Injectable()
export class TelemetryTransportService {
  constructor(@Inject(TOKENS.RMQ) private readonly rmq: ClientProxy) {}

  @OnEvent(EMMITER_EVENTS.NEW_TELEMETRY)
  handleTelemetry(data: TelemetryData) {
    this.rmq.emit(RMQ_EVENTS.NEW_TELEMETRY, data);
  }
}

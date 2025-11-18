import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_EVENTS } from 'libs/shared';
import { TelemetryDataDTO } from 'libs/shared/util/DTO/telemetryData';
import { TOKENS } from 'libs/shared/util/nestjs.tokens';
import { EMMITER_EVENTS } from '../util/EmmiterEvents';

@Injectable()
export class TelemetryEventsService {
  constructor(@Inject(TOKENS.RMQ) private readonly rmq: ClientProxy) {}

  @OnEvent(EMMITER_EVENTS.NEW_TELEMETRY)
  handleTelemetry(data: TelemetryDataDTO) {
    this.rmq.emit(RMQ_EVENTS.NEW_TELEMETRY, data);
  }
}

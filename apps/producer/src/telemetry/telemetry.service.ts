import { EVENTS, TelemetryPayload } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TelemetryService implements OnModuleInit {
  constructor(@Inject(TOKENS.RMQ) private readonly RMQ: ClientProxy) {}

  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.start();
  }

  private generateTelemetryData(): TelemetryPayload {
    return {
      deviceId: uuidv4(),
      humidity: Math.floor(Math.random() * 30) + 30,
      temperature: Math.floor(Math.random() * 10) + 20,
      timestamp: Date.now(),
    };
  }

  private sendTelemetry(payload: TelemetryPayload) {
    this.RMQ.emit(EVENTS.HELLO, payload);
  }

  private start() {
    this.intervalId = setInterval(() => {
      const data = this.generateTelemetryData();
      this.sendTelemetry(data);
    }, 10000);
  }

  private stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

import { EVENTS, TelemetryPayload } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TelemetryService implements OnModuleInit {
  static DEVICE_ID = uuidv4();
  /** in seconds */
  static MESUREMENT_INTERVAL = 10;

  constructor(@Inject(TOKENS.RMQ) private readonly RMQ: ClientProxy) {}

  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.start();
  }

  generateTelemetryData(): TelemetryPayload {
    return {
      deviceId: TelemetryService.DEVICE_ID,
      humidity: Math.floor(Math.random() * 30) + 30,
      temperature: Math.floor(Math.random() * 10) + 20,
      timestamp: Date.now(),
    };
  }

  sendTelemetry(payload: TelemetryPayload) {
    this.RMQ.emit(EVENTS.NEW_TELEMETRY, payload);
  }

  start() {
    this.intervalId = setInterval(() => {
      const data = this.generateTelemetryData();
      this.sendTelemetry(data);
    }, TelemetryService.MESUREMENT_INTERVAL * 1000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

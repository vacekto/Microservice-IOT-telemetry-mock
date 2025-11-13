import { EVENTS, TelemetryData } from '@app/shared';
import { TOKENS } from '@app/shared/tokents';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TelemetryService implements OnModuleInit {
  static DEVICE_ID = process.env.PRODUCER_ID as string;

  /** in seconds */
  static MESUREMENT_INTERVAL = 10;

  constructor(@Inject(TOKENS.RMQ) private readonly RMQ: ClientProxy) {}

  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.start();
  }

  generateTelemetryData(): TelemetryData {
    return {
      deviceId: TelemetryService.DEVICE_ID,
      humidity: Math.floor(Math.random() * 30) + 30,
      temperature: Math.floor(Math.random() * 10) + 20,
      timestamp: Date.now(),
    };
  }

  sendTelemetry(payload: TelemetryData) {
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

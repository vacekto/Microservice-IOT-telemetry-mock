import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TelemetryData } from 'libs/shared';
import { EMMITER_EVENTS } from '../util/EmmiterEvents';

@Injectable()
export class TelemetryService implements OnModuleInit {
  // must be valid UUID !!
  static DEVICE_ID = process.env.PRODUCER_ID as string;

  /** in seconds */
  static MESUREMENT_INTERVAL = 3;

  constructor(private readonly events: EventEmitter2) {}

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

  sendTelemetry(data: TelemetryData) {
    this.events.emit(EMMITER_EVENTS.NEW_TELEMETRY, data);
  }

  start() {
    this.intervalId = setInterval(() => {
      const data = this.generateTelemetryData();
      this.events.emit(EMMITER_EVENTS.NEW_TELEMETRY, data);
    }, TelemetryService.MESUREMENT_INTERVAL * 1000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

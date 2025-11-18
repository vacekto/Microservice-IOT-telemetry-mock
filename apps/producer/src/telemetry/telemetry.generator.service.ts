import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { TelemetryDataDTO } from 'libs/shared/util/DTO/telemetryData';
import { EMMITER_EVENTS } from '../util/EmmiterEvents';

@Injectable()
export class GeneratorService implements OnModuleInit {
  // must be valid UUID !!
  static DEVICE_ID = (process.env.PRODUCER_ID as string) ?? randomUUID();

  /** in seconds */
  static MESUREMENT_INTERVAL = 10;

  constructor(private readonly events: EventEmitter2) {}

  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.start();
  }

  generateTelemetryData(): TelemetryDataDTO {
    return {
      deviceId: GeneratorService.DEVICE_ID,
      humidity: Math.floor(Math.random() * 30) + 30,
      temperature: Math.floor(Math.random() * 10) + 20,
      timestamp: Date.now(),
    };
  }

  sendTelemetry(data: TelemetryDataDTO) {
    this.events.emit(EMMITER_EVENTS.NEW_TELEMETRY, data);
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      const data = this.generateTelemetryData();
      this.events.emit(EMMITER_EVENTS.NEW_TELEMETRY, data);
    }, GeneratorService.MESUREMENT_INTERVAL * 1000);
  }

  stop() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

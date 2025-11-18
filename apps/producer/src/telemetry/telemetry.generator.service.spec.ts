import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { EMMITER_EVENTS } from '../util/EmmiterEvents';
import { GeneratorService } from './telemetry.generator.service';

describe('GeneratorService', () => {
  let service: GeneratorService;
  let eventEmitterMock: { emit: jest.Mock<any, any> };

  beforeEach(async () => {
    jest.useFakeTimers();

    eventEmitterMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: EventEmitter2, useValue: eventEmitterMock },
        GeneratorService,
      ],
    }).compile();

    service = module.get<GeneratorService>(GeneratorService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ---------------------------------------------------------
  // generateTelemetryData
  // ---------------------------------------------------------

  describe('generateTelemetryData', () => {
    it('should generate telemetry data with required fields', () => {
      const data = service.generateTelemetryData();

      expect(data).toHaveProperty('deviceId');
      expect(data).toHaveProperty('humidity');
      expect(data).toHaveProperty('temperature');
      expect(data).toHaveProperty('timestamp');
    });

    it('should generate humidity between 30 and 60', () => {
      const data = service.generateTelemetryData();
      expect(data.humidity).toBeGreaterThanOrEqual(30);
      expect(data.humidity).toBeLessThanOrEqual(60);
    });

    it('should generate temperature between 20 and 30', () => {
      const data = service.generateTelemetryData();
      expect(data.temperature).toBeGreaterThanOrEqual(20);
      expect(data.temperature).toBeLessThanOrEqual(30);
    });
  });

  describe('sendTelemetry', () => {
    it('should call eventEmitter.emit with correct arguments', () => {
      const fakeData = {
        deviceId: 'abc',
        humidity: 50,
        temperature: 22,
        timestamp: 999,
      };

      service.sendTelemetry(fakeData);

      expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        EMMITER_EVENTS.NEW_TELEMETRY,
        fakeData,
      );
    });
  });

  describe('start', () => {
    it('should start emitting telemetry periodically', () => {
      service.start();

      jest.advanceTimersByTime(GeneratorService.MESUREMENT_INTERVAL * 1000);

      expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        EMMITER_EVENTS.NEW_TELEMETRY,
        expect.any(Object),
      );
    });

    it('should not start a new interval if one already exists', () => {
      service.start();
      service.start();

      jest.advanceTimersByTime(GeneratorService.MESUREMENT_INTERVAL * 1000 * 2);

      expect(eventEmitterMock.emit).toHaveBeenCalledTimes(2);
    });
  });

  describe('stop', () => {
    it('should stop emitting telemetry', () => {
      service.start();

      jest.advanceTimersByTime(GeneratorService.MESUREMENT_INTERVAL * 1000);
      expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);

      service.stop();

      jest.advanceTimersByTime(GeneratorService.MESUREMENT_INTERVAL * 1000);

      expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
    });

    it('should not throw if stop is called when no interval is running', () => {
      expect(() => service.stop()).not.toThrow();
    });
  });
});

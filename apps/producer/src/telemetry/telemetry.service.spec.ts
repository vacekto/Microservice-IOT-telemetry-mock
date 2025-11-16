import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryData } from 'libs/shared';
import { TOKENS } from 'libs/shared/util/nestjs.tokents';
import { TelemetryService } from './telemetry.generator.service';

describe('TelemetryService', () => {
  let service: TelemetryService;
  let mockRMQ: jest.Mocked<Pick<ClientProxy, 'emit'>>;

  beforeEach(async () => {
    mockRMQ = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService, { provide: TOKENS.RMQ, useValue: mockRMQ }],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate valid telemetry data', () => {
    const data = service.generateTelemetryData();

    expect(data).toHaveProperty('deviceId', TelemetryService.DEVICE_ID);
    expect(typeof data.humidity).toBe('number');
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.timestamp).toBe('number');
  });

  it('should send telemetry over eventEmitter2', () => {
    const fakeData: TelemetryData = {
      deviceId: 'cosikdosi123',
      humidity: 50,
      temperature: 25,
      timestamp: 12345,
    };

    service.sendTelemetry(fakeData);

    expect(mockRMQ.emit).toHaveBeenCalledWith(expect.any(String), fakeData);
  });

  it('should start and stop telemetry loop', () => {
    jest.useFakeTimers();

    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    service.start();
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    service.stop();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});

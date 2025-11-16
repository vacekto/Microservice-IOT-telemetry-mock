import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TelemetryData } from 'libs/shared';
import { RedisService } from '../Redis/redis.service';
import { TelemetryHttpController } from './telemetry.http.controller';

describe('TelemetryHttpController', () => {
  let controller: TelemetryHttpController;
  let mockRedisService: Partial<jest.Mocked<RedisService>>;

  beforeEach(async () => {
    mockRedisService = {
      getTelemetryRange: jest.fn(),
      getTelemetryLatest: jest.fn(),
      getAllDeviceKeys: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryHttpController],
      providers: [{ provide: RedisService, useValue: mockRedisService }],
    }).compile();

    controller = module.get(TelemetryHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call RedisService.getTelemetryRange with parsed timestamps', async () => {
    const params = {
      from: new Date().toISOString(),
      to: new Date().toISOString(),
      deviceId: randomUUID(),
      count: 10,
    };

    const mockResult: TelemetryData[] = [
      {
        deviceId: params.deviceId,
        temperature: 25,
        humidity: 45,
        timestamp: 123,
      },
    ];
    mockRedisService!.getTelemetryRange!.mockResolvedValue(mockResult);

    const result = await controller.getTelemetryRange(params);

    expect(mockRedisService.getTelemetryRange).toHaveBeenCalledWith({
      deviceId: params.deviceId,
      count: 10,
      start: Date.parse(params.from),
      end: Date.parse(params.to),
    });

    expect(result).toEqual(mockResult);
  });

  it('should call RedisService.getTelemetryLatest with DTO params', async () => {
    const params = {
      deviceId: randomUUID(),
      count: 5,
    };
    const mockResult: TelemetryData[] = [
      {
        deviceId: params.deviceId,
        temperature: 22,
        humidity: 43,
        timestamp: 123,
      },
    ];
    mockRedisService!.getTelemetryLatest!.mockResolvedValue(mockResult);

    const result = await controller.getTelemetryLatest(params);

    expect(mockRedisService.getTelemetryLatest).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockResult);
  });

  it('should call RedisService.getAllDeviceKeys', async () => {
    const devices = ['dev1', 'dev2'];
    mockRedisService!.getAllDeviceKeys!.mockResolvedValue(devices);

    const result = await controller.getDevices();

    expect(mockRedisService.getAllDeviceKeys).toHaveBeenCalled();
    expect(result).toEqual(devices);
  });
});

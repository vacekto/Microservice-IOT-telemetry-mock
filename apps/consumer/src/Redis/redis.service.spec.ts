import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryData } from 'libs/shared';
import { TOKENS } from 'libs/shared/util/nestjs.tokents';
import { GetTelemetryRangeProps, RedisService } from './redis.service';

describe('RedisService behaviour', () => {
  let service: RedisService;
  let mockRedis: {
    zrangebyscore: jest.Mock<any, any>;
    zadd: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    mockRedis = {
      zrangebyscore: jest.fn(),
      zadd: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: TOKENS.REDIS, useValue: mockRedis }, RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save telemetry data to redis ZSET', async () => {
    const mockData: TelemetryData = {
      deviceId: 'uuid-123',
      humidity: 25,
      temperature: 35,
      timestamp: 16145134,
    };
    await service.saveTelemetry(mockData);

    expect(mockRedis.zadd).toHaveBeenCalledTimes(1);
    expect(mockRedis.zadd).toHaveBeenCalledWith(
      `${service.zsetKey}:${mockData.deviceId}`,
      mockData.timestamp,
      JSON.stringify(mockData),
    );
  });

  it('returns parsed telemetry items and calls zrangebyscore with provided count', async () => {
    const items = [
      { deviceId: 'dev1', timestamp: 1000, value: 1 },
      { deviceId: 'dev1', timestamp: 1001, value: 2 },
    ];
    mockRedis.zrangebyscore.mockResolvedValue(
      items.map((i) => JSON.stringify(i)),
    );

    const result = await service.getTelemetryRange({
      start: 900,
      end: 1100,
      deviceId: 'dev1',
      count: 10,
    });

    expect(mockRedis.zrangebyscore).toHaveBeenCalledWith(
      `${service.zsetKey}:dev1`,
      900,
      1100,
      'LIMIT',
      0,
      10,
    );

    expect(result).toEqual(items);
  });

  it('uses default count (50) when count is not provided', async () => {
    const items = [{ deviceId: 'uuid-123', timestamp: 2000, value: 'x' }];
    mockRedis.zrangebyscore.mockResolvedValue(
      items.map((i) => JSON.stringify(i)),
    );

    const mockedInput: GetTelemetryRangeProps = {
      start: 1500,
      end: 2500,
      deviceId: 'device-UUID',
    };

    const result = await service.getTelemetryRange(mockedInput);

    expect(mockRedis.zrangebyscore).toHaveBeenCalledWith(
      `${service.zsetKey}:${mockedInput.deviceId}`,
      1500,
      2500,
      'LIMIT',
      0,
      50,
    );

    expect(result).toEqual(items);
  });
});

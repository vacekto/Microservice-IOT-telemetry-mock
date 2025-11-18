import { GetTelemetryLatestDto } from '@consumer/telemetry/Dtos/getTelemetryLatestDto';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TOKENS } from 'libs/shared';
import { TelemetryDataDTO } from 'libs/shared/util/DTO/telemetryData';
import { GetTelemetryRangeProps, RedisService } from './redis.service';

describe('Redis service', () => {
  let service: RedisService;
  let redisClientMock: {
    zrangebyscore: jest.Mock<any, any>;
    zrevrange: jest.Mock<any, any>;
    zadd: jest.Mock<any, any>;
    keys: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    redisClientMock = {
      zrangebyscore: jest.fn().mockResolvedValue([
        JSON.stringify({
          deviceId: '123',
          temperature: 25,
          humidity: 50,
          timestamp: 5000,
        }),
        JSON.stringify({
          deviceId: '124',
          temperature: 26,
          humidity: 55,
          timestamp: 6000,
        }),
      ]),
      zrevrange: jest.fn().mockResolvedValue([
        JSON.stringify({
          deviceId: '124',
          temperature: 26,
          humidity: 55,
          timestamp: 6000,
        }),
        JSON.stringify({
          deviceId: '123',
          temperature: 25,
          humidity: 50,
          timestamp: 5000,
        }),
      ]),
      zadd: jest.fn(),
      keys: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TOKENS.REDIS, useValue: redisClientMock },
        RedisService,
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  describe('saveTelemetry', () => {
    let input: TelemetryDataDTO;

    beforeEach(() => {
      input = {
        deviceId: randomUUID(),
        humidity: 45,
        temperature: 32,
        timestamp: 123,
      };
    });
    it('should call the client.zadd method with correct arguents', async () => {
      await service.saveTelemetry(input);

      const expectedKey = `${RedisService.zsetKey}:${input.deviceId}`;

      const expectedJson = JSON.stringify(input);

      expect(redisClientMock.zadd).toHaveBeenCalledTimes(1);
      expect(redisClientMock.zadd).toHaveBeenCalledWith(
        expectedKey,
        input.timestamp,
        expectedJson,
      );
    });
  });

  describe('getTelemetryRange', () => {
    let input: GetTelemetryRangeProps;
    let expectedKey: string;
    beforeEach(() => {
      input = {
        deviceId: randomUUID(),
        start: 500,
        end: 1000,
        count: 30,
      };

      expectedKey = `${RedisService.zsetKey}:${input.deviceId}`;
    });
    // zrangebyscore
    it('should call client.zrangebyscore method with correct arguents', async () => {
      const expectedOffset = 0;

      await service.getTelemetryRange(input);

      expect(redisClientMock.zrangebyscore).toHaveBeenCalledTimes(1);
      expect(redisClientMock.zrangebyscore).toHaveBeenCalledWith(
        expectedKey,
        input.start,
        input.end,
        'LIMIT',
        expectedOffset,
        input.count,
      );
    });

    it('should return an array', async () => {
      const res = await service.getTelemetryRange(input);
      expect(Array.isArray(res)).toBe(true);
    });

    it('should use default count value (50)', async () => {
      const expectedOffset = 0;
      delete input.count;

      await service.getTelemetryRange(input);

      expect(redisClientMock.zrangebyscore).toHaveBeenCalledWith(
        expectedKey,
        input.start,
        input.end,
        'LIMIT',
        expectedOffset,
        50,
      );
    });

    it('should use maximum count limit (100) if count is higher', async () => {
      const expectedOffset = 0;
      input.count = 3000;

      await service.getTelemetryRange(input);

      expect(redisClientMock.zrangebyscore).toHaveBeenCalledTimes(1);
      expect(redisClientMock.zrangebyscore).toHaveBeenCalledWith(
        expectedKey,
        input.start,
        input.end,
        'LIMIT',
        expectedOffset,
        100,
      );
    });
  });

  describe('getTelemetryLatest', () => {
    let input: GetTelemetryLatestDto;

    let expectedKey: string;

    beforeEach(() => {
      input = {
        deviceId: randomUUID(),
        count: 40,
      };

      expectedKey = `${RedisService.zsetKey}:${input.deviceId}`;
    });

    it('should call the zrevrange redis client method with correct arguents', async () => {
      await service.getTelemetryLatest(input);

      expect(redisClientMock.zrevrange).toHaveBeenCalledTimes(1);
      expect(redisClientMock.zrevrange).toHaveBeenCalledWith(
        expectedKey,
        0,
        input.count! - 1,
      );
    });

    it('should return an array', async () => {
      const res = await service.getTelemetryLatest(input);
      expect(Array.isArray(res)).toBe(true);
    });

    it('should use default count value (30)', async () => {
      delete input.count;
      await service.getTelemetryLatest(input);
      expect(redisClientMock.zrevrange).toHaveBeenCalledWith(
        expectedKey,
        0,
        29,
      );
    });

    it('should use maximum count limit (100) if count is higher', async () => {
      input.count = 3000;
      await service.getTelemetryLatest(input);
      expect(redisClientMock.zrevrange).toHaveBeenCalledWith(
        expectedKey,
        0,
        99,
      );
    });
  });

  describe('getAllDeviceKeys', () => {
    const expctedInput: string = `${RedisService.zsetKey}:*`;

    it('should call client.keys with the correct arguments', async () => {
      await service.getAllDeviceKeys();

      expect(redisClientMock.keys).toHaveBeenCalledTimes(1);
      expect(redisClientMock.keys).toHaveBeenCalledWith(expctedInput);
    });
  });
});

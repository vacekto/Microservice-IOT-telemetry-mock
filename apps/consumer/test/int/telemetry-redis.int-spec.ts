import { TelemetryData } from '@app/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerModule } from 'apps/consumer/src/consumer.module';
import { RedisService } from 'apps/consumer/src/Redis/redis.service';
import { TelemetryHttpController } from 'apps/consumer/src/telemetry/telemetry.http.controller';
import Redis from 'ioredis';

describe('Integration for TelemetryHttpController and RedisService', () => {
  let module: TestingModule;
  let redisService: RedisService;
  let controller: TelemetryHttpController;
  let rawRedis: Redis;

  const deviceId = 'test-device';

  beforeAll(async () => {
    // raw redis connection for cleanup
    rawRedis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    module = await Test.createTestingModule({
      imports: [ConsumerModule],
    }).compile();

    redisService = module.get(RedisService);
    controller = module.get(TelemetryHttpController);
  });

  beforeEach(async () => {
    await rawRedis.flushdb();
  });

  afterAll(async () => {
    await redisService.close();
    await module.close();
    await rawRedis.quit();
  });

  test('saveTelemetry + getTelemetryLatest through controller', async () => {
    const now = Date.now();

    await redisService.saveTelemetry({
      deviceId,
      timestamp: now,
      temperature: 21.5,
      humidity: 50,
    });

    const result = await controller.getTelemetryLatest({
      deviceId,
      count: 10,
    });

    expect(result.length).toBe(1);
    expect(result[0].deviceId).toBe(deviceId);
    expect(result[0].temperature).toBe(21.5);
  });

  test('saveTelemetry + getTelemetryRange through controller', async () => {
    const t1 = Date.now() - 1000;
    const t2 = Date.now();

    await redisService.saveTelemetry({
      deviceId,
      timestamp: t1,
      temperature: 10,
      humidity: 40,
    });

    await redisService.saveTelemetry({
      deviceId,
      timestamp: t2,
      temperature: 20,
      humidity: 30,
    });

    const from = new Date(t1 - 1).toISOString();
    const to = new Date(t2 + 1).toISOString();

    const result = await controller.getTelemetryRange({
      deviceId,
      from,
      to,
      count: 10,
    });

    expect(result.length).toBe(2);
    expect(result[0].temperature).toBe(10);
    expect(result[1].temperature).toBe(20);
  });

  test('getDevices returns device id', async () => {
    await redisService.saveTelemetry({
      deviceId,
      timestamp: Date.now(),
      temperature: 30,
    } as TelemetryData);

    const devices = await controller.getDevices();

    expect(devices).toContain(deviceId);
  });
});

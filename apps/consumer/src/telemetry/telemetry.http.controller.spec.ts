import { RedisService } from '@consumer/Redis/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTelemetryLatestDto } from './Dtos/getTelemetryLatestDto';
import { GetTelemetryRamgeDto } from './Dtos/getTelemetryRangeDto';
import { TelemetryHttpController } from './telemetry.http.controller';

describe('telemetry.http.controller', () => {
  let controller: TelemetryHttpController;
  let redisServiceMock: {
    getTelemetryRange: jest.Mock<any, any>;
    getTelemetryLatest: jest.Mock<any, any>;
    getAllDeviceKeys: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    redisServiceMock = {
      getAllDeviceKeys: jest.fn().mockResolvedValue(['dev1', 'dev2']),
      getTelemetryLatest: jest.fn(),
      getTelemetryRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: RedisService, useValue: redisServiceMock },
        TelemetryHttpController,
      ],
    }).compile();

    controller = module.get<TelemetryHttpController>(TelemetryHttpController);
  });

  describe('getTelemetryRange', () => {
    it('should call redisService.getTelemetryRange method', async () => {
      await controller.getTelemetryRange({} as GetTelemetryRamgeDto);
      expect(redisServiceMock.getTelemetryRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTelemetryLatest', () => {
    it('should call redisService.getTelemetryLatest method', async () => {
      await controller.getTelemetryLatest({} as GetTelemetryLatestDto);
      expect(redisServiceMock.getTelemetryLatest).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDevices', () => {
    it('should call redisService.getAllDeviceKeys method', async () => {
      await controller.getDevices();
      expect(redisServiceMock.getAllDeviceKeys).toHaveBeenCalledTimes(1);
    });
  });
});

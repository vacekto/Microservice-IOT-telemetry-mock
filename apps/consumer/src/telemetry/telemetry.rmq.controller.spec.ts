import { TelemetryDataDTO } from '@app/shared/util/DTO/telemetryData';
import { RedisService } from '@consumer/Redis/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TelemetryRMQController } from './telemetry.rmq.controller';

describe('telemetry.rmq.controller', () => {
  let controller: TelemetryRMQController;
  let redisServiceMock: {
    saveTelemetry: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    redisServiceMock = {
      saveTelemetry: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: RedisService, useValue: redisServiceMock },
        TelemetryRMQController,
      ],
    }).compile();

    controller = module.get<TelemetryRMQController>(TelemetryRMQController);
  });

  describe('handleTelemetry', () => {
    let input: TelemetryDataDTO;

    beforeEach(() => {
      input = {
        deviceId: randomUUID(),
        humidity: 45,
        temperature: 32,
        timestamp: 123,
      };
    });

    it('should call the redisService.saveTelemetry method with correct arguents', async () => {
      await controller.handleTelemetry(input);

      expect(redisServiceMock.saveTelemetry).toHaveBeenCalledTimes(1);
      expect(redisServiceMock.saveTelemetry).toHaveBeenCalledWith(input);
    });
  });
});

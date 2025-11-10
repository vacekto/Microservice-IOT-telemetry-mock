import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryRMQController } from './telemetry.rmq.controller';

describe('TelemetryController', () => {
  let controller: TelemetryRMQController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryRMQController],
    }).compile();

    controller = module.get<TelemetryRMQController>(TelemetryRMQController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { RMQ_EVENTS, TOKENS } from '@app/shared/index';
import { TelemetryDataDTO } from '@app/shared/util/DTO/telemetryData';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TelemetryEventsService } from './telemetry.events.service';

describe('telemetry.events.service', () => {
  let service: TelemetryEventsService;
  let rmqMock: {
    emit: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    rmqMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TOKENS.RMQ, useValue: rmqMock },
        TelemetryEventsService,
      ],
    }).compile();

    service = module.get<TelemetryEventsService>(TelemetryEventsService);
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

    it('should call the rmq.emit method with correct arguents', () => {
      service.handleTelemetry(input);

      expect(rmqMock.emit).toHaveBeenCalledTimes(1);
      expect(rmqMock.emit).toHaveBeenCalledWith(
        RMQ_EVENTS.NEW_TELEMETRY,
        input,
      );
    });
  });
});

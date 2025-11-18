import { TelemetryDataDTO } from '@app/shared/util/DTO/telemetryData';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { TelemetryEventsService } from '@producer/telemetry/telemetry.events.service';
import { GeneratorService } from '@producer/telemetry/telemetry.generator.service';
import { TOKENS } from 'libs/shared';

describe('Telemetry Integration', () => {
  let generator: GeneratorService;
  let mockRMQ: { emit: jest.Mock<void, [string, TelemetryDataDTO]> };
  let handleSpy: jest.Mock;

  beforeEach(async () => {
    mockRMQ = { emit: jest.fn<void, [string, TelemetryDataDTO]>() };
    handleSpy = jest.fn();

    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        GeneratorService,

        {
          provide: TelemetryEventsService,
          useFactory: () => ({
            handleTelemetry: handleSpy,
            rmq: mockRMQ,
          }),
        },

        { provide: TOKENS.RMQ, useValue: mockRMQ },
      ],
    }).compile();

    generator = moduleRef.get(GeneratorService);
  });

  it('should call handleTelemetry when generator emits', () => {
    const data = generator.generateTelemetryData();

    generator.sendTelemetry(data);

    expect(handleSpy).toHaveBeenCalledTimes(1);
    expect(handleSpy).toHaveBeenCalledWith(data);

    expect(mockRMQ.emit).toHaveBeenCalledTimes(1);
  });
});

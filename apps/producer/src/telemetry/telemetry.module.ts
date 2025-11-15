import { QUEUES, TOKENS } from '@app/shared';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TelemetryService } from './telemetry.service';
import { TelemetryTransportService as TelemetryTransportController } from './telemetry.transport.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ClientsModule.register([
      {
        name: TOKENS.RMQ,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PWD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
          ],
          queue: QUEUES.MESSAGES,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [TelemetryService, TelemetryTransportController],
})
export class TelemetryModule {}

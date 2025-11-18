import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES, TOKENS } from 'libs/shared';
import { TelemetryEventsService } from './telemetry.events.service';
import { GeneratorService } from './telemetry.generator.service';

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
          queue: RMQ_QUEUES.MESSAGES,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [GeneratorService, TelemetryEventsService],
})
export class TelemetryModule {}

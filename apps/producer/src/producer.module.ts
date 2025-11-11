import { QUEUES } from '@app/shared/queues';
import { TOKENS } from '@app/shared/tokents';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TelemetryService } from './telemetry/telemetry.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TOKENS.RMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: QUEUES.MESSAGES,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [TelemetryService],
})
export class ProducerModule {}

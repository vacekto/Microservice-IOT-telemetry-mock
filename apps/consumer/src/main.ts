import { QUEUES } from '@app/shared/queus';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: QUEUES.messages_queue,
        queueOptions: { durable: false },
      },
    },
  );

  await app.listen();
  console.log('consumer running');
}
void bootstrap();

import { QUEUES } from '@app/shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);

  const config = new DocumentBuilder()
    .setTitle('Telemetry Consumer API')
    .setDescription('API for consuming and retrieving telemetry data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: QUEUES.MESSAGES,
      queueOptions: { durable: false },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT!);

  console.log('consumer service running on port: ', process.env.PORT);
}
void bootstrap();

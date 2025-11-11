import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);
  await app.listen(process.env.PORT!);
  console.log('producer service running on port: ', process.env.PORT);
}
void bootstrap();

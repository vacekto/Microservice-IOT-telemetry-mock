import { NestFactory } from '@nestjs/core';
import { LOG_LEVELS } from 'libs/shared/util/constants';
import { ProducerModule } from './producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule, {
    logger: LOG_LEVELS,
  });
  await app.listen(process.env.PORT!);
  console.log('producer service running on port: ', process.env.PORT);
}
void bootstrap();

import { TestingSharedType } from '@app/shared';
import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);

  await app.listen(process.env.PORT ?? 3000);
  const test_var: TestingSharedType = true;
  console.log('producer started, :', test_var);
}
void bootstrap();

import { TOKENS } from '@app/shared';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: TOKENS.REDIS,
      useFactory: () =>
        new Redis({
          host: process.env.REDIS_HOST as string,
          port: Number(process.env.REDIS_PORT),
        }),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}

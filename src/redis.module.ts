import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis-yet';
import { Global } from '@nestjs/common';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60, // default TTL (seconds)
    }),
  ],

  exports: [CacheModule],
})
export class RedisModule {}

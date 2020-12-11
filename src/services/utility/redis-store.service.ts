import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export default class RedisStoreService {
  constructor(private readonly redisService: RedisService) {}

  public async get(key: string): Promise<string> {
    const client: Redis = this.redisService.getClient();

    return await client.get(key);
  }

  public async set(key: string, value: string, expirationSeconds?: number): Promise<void> {
    const client: Redis = this.redisService.getClient();

    await client.set(key, value);

    if (expirationSeconds) await client.expire(key, expirationSeconds);
  }

  public async unlink(key: string): Promise<void> {
    const client: Redis = this.redisService.getClient();

    await client.unlink(key);
  }
}

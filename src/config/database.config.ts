import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import models from '../models';

export function databaseConfiguration(): TypeOrmModuleOptions {
  const {
    DB_DRIVER,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_SYNC,
    DB_QUERY_CACHE,
    DB_QUERY_CACHE_DURATION,
    NODE_ENV,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_DB,
  } = process.env;
  const type: any = DB_DRIVER;
  const cacheType: any = DB_QUERY_CACHE;

  return {
    type,
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: DB_SYNC === 'true',
    logging: NODE_ENV === 'local' || NODE_ENV === 'staging',
    entities: [...models],
    cache: {
      type: cacheType,
      options: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
        db: +REDIS_DB,
        duration: +DB_QUERY_CACHE_DURATION * 1000,
      },
    },
  };
}

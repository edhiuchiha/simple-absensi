import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'path';

loadEnv();
process.env.BASE_PATH = dirname(resolve('package.json'));

export * from './app.config';
export * from './database.config';
export * from './redis.config';
export * from './passport.config';

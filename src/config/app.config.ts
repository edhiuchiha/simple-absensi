import * as moment from 'moment-timezone';
import * as cookieParser from 'cookie-parser';
import * as limiter from 'express-rate-limit';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { HttpException, HttpStatus, Logger, NestApplicationOptions } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import HttpExceptionFilter from '../utils/http-exception.filter';

function corsConfiguration(): CorsOptions {
  const allowedOrigins: string[] = [process.env.APP_DOMAIN];

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(`localhost`);
  }

  return {
    credentials: true,
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.some(origin => requestOrigin.indexOf(origin) >= 0)) {
        callback(null, true);
      } else {
        callback(new HttpException('Not served.', HttpStatus.NO_CONTENT), false);
      }
    },
  };
}

export function serverOptions(): NestApplicationOptions {
  let config: NestApplicationOptions;

  if (!process.env.APP_ID)
    throw new Error(`Environment variables might have not been set correctly.`);

  if (process.env.NODE_ENV === 'local') {
    Logger.log(
      `Setting up SSL certificate for ${process.env.NODE_ENV} environment`,
      'app.config@serverOptions',
      true,
    );

    const sslKeyPath = resolve(process.env.SSL_KEY_PATH);
    const sslCertPath = resolve(process.env.SSL_CERT_PATH);

    try {
      config = {
        httpsOptions: {
          key: readFileSync(sslKeyPath),
          cert: readFileSync(sslCertPath),
        },
      };
    } catch (error) {
      Logger.error(
        `SSL key and certificate cannot be found on ${dirname(sslKeyPath)}`,
        error.trace,
        'app.config@serverOptions',
        true,
      );
    }
  }

  return config;
}

export function configure(app: NestApplication): void {
  Logger.log(`Configuring application ${process.env.APP_NAME}`, 'app.config@configure', true);

  app.enableCors({ ...corsConfiguration() });
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    limiter({
      windowMS: Number(process.env.RATE_LIMITER_WINDOW) * 60 * 1000,
      max: process.env.RATE_LIMITER_MAX_REQUESTS,
    }),
  );

  app.setGlobalPrefix(`api/${process.env.APP_VERSION}`);
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useStaticAssets(resolve('assets'));
  // app.setBaseViewsDir(resolve('views'));
  // app.setViewEngine('hbs');

  moment.tz.setDefault(process.env.TZ);
}

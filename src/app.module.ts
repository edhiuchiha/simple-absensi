import { RedisModule } from 'nestjs-redis';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { databaseConfiguration, passportConfiguration, redisConfiguration } from './config';
import ControllerModule from './controllers/controller.module';
import UtilityModule from './utils/utility.module';
import ServiceModule from './services/service.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...databaseConfiguration() }),
    RedisModule.register({ ...redisConfiguration() }),
    PassportModule.register({ ...passportConfiguration() }),
    UtilityModule,
    ServiceModule,
    ControllerModule,
  ],
  exports: [TypeOrmModule],
})
export default class AppModule {}

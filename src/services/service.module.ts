import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UtilityModule from '../utils/utility.module';
import models from '../models';
import services from './index';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([...models]), UtilityModule],
  providers: [...services],
  exports: [...services],
})
export default class ServiceModule {}

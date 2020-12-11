import { Module } from '@nestjs/common';
import ServiceModule from '../services/service.module';
import UtilityModule from '../utils/utility.module';
import controllers from './index';

@Module({
  imports: [ServiceModule, UtilityModule],
  controllers: [...controllers],
})
export default class ControllerModule {}

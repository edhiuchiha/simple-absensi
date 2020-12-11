import { Module } from '@nestjs/common';
import HashUtil from './common-util/hash.util';

@Module({
  providers: [HashUtil],
  exports: [HashUtil],
})
export default class UtilityModule {}

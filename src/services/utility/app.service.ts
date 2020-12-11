import * as moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';
import { Result } from '../../utils/query-result/result.class';

@Injectable()
export default class AppService {
  check(): Result<string> {
    return {
      result: moment().toISOString(true),
    };
  }
}

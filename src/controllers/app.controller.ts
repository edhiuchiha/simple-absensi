import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Result } from '../utils/query-result/result.class';
import ResponseUtil from '../utils/response-util/response.util';
import AppService from '../services/utility/app.service';
import Routes from '../config/app.routes';

@Controller(Routes.HEALTH_CHECK)
@UseInterceptors(ResponseUtil)
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  check(): Result<string> {
    return this.appService.check();
  }
}

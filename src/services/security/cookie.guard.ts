import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import GuardService from './guard.service';

@Injectable()
export default class CookieGuard extends AuthGuard('cookie') {
  constructor(private readonly guardService: GuardService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const cookie: string = context.switchToHttp().getRequest().cookies[process.env.TOKEN_NAME];
    const method: string = context.switchToHttp().getRequest().method;
    let url: string = context.switchToHttp().getRequest().route.path;
    url = url.indexOf('/:') > -1 ? url.slice(0, url.indexOf('/:')) : url;

    return Promise.all([
      super.canActivate(context),
      this.validateSession(cookie, url, method),
    ]).then(([canActivate, validSession]) => {
      return canActivate && validSession;
    }); // this.validateSession(cookie, url, method);
  }

  private async validateSession(token: string, url: string, method: string): Promise<boolean> {
    return this.guardService.validateAccess(token, url, method);
  }

}

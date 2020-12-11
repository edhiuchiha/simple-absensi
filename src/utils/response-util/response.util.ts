import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor } from '@nestjs/common';
import { HttpStatusMessage, ResponseEntity, ResponseStatus } from './response.class';
import { Observable } from 'rxjs';
import { Result } from '../query-result/result.class';
import { map } from 'rxjs/operators';

export default class ResponseUtil<T> implements NestInterceptor<T, ResponseEntity<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseEntity<T>> | Promise<Observable<ResponseEntity<T>>> {
    const responseContext = context.switchToHttp().getResponse();

    return next.handle().pipe(map((data: any) => this.build(responseContext, data)));
  }

  private build(responseContext, queryResult: Result<T>): ResponseEntity<T> {
    const { result: data, paging, status } = queryResult || {
      result: undefined,
      paging: undefined,
      status: undefined,
    };
    const responseStatus: ResponseStatus = status || {
      code: responseContext.statusCode,
      description:
        responseContext.statusMessage || HttpStatusMessage[responseContext.statusCode] || '-',
    };

    if (responseContext.statusCode === HttpStatus.NO_CONTENT) return null;

    if (status) responseContext.statusCode = status.code;

    return { status: responseStatus, data, paging };
  }
}

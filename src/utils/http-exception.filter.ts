import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatusMessage, ResponseStatus } from './response-util/response.class';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { error } = exception.getResponse() as any;
    let { message } = exception.getResponse() as any;

    if (Array.isArray(message)) {
      const validationError: ValidationError = message.shift();
      const constraint: string = Object.keys(validationError.constraints).shift();

      message = `Form validation failed: ${validationError.constraints[constraint]}.`;
    }

    const status: ResponseStatus = {
      code: exception.getStatus(),
      description: message || HttpStatusMessage[exception.getStatus()] || error,
    };

    response.status(exception.getStatus()).json({ status });
  }
}

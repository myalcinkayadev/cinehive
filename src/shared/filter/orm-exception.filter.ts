import {
  NotFoundError,
  UniqueConstraintViolationException,
  ValidationError,
} from '@mikro-orm/core';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionStrategy } from './orm-exception/exception-strategy';
import { EntityNotFoundStrategy } from './orm-exception/mikro-orm/entity-not-found.strategy';
import { UniqueConstraintViolationStrategy } from './orm-exception/mikro-orm/unique-constraint-violation.strategy';
import { ValidationErrorStrategy } from './orm-exception/mikro-orm/validation-error.strategy';
import { DefaultStrategy } from './orm-exception/default-strategy';

@Catch(ValidationError, UniqueConstraintViolationException, NotFoundError)
export class OrmExceptionFilter implements ExceptionFilter {
  private strategies: ExceptionStrategy[] = [
    new ValidationErrorStrategy(),
    new UniqueConstraintViolationStrategy(),
    new EntityNotFoundStrategy(),
    new DefaultStrategy(),
  ];

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const strategy = this.strategies.find((s) => s.match(exception));
    const { status, message } = strategy.getResponse(exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

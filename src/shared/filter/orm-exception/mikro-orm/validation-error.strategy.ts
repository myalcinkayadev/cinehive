import { ValidationError } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { ExceptionStrategy } from '../exception-strategy';

export class ValidationErrorStrategy implements ExceptionStrategy {
  match(error: Error): boolean {
    return error instanceof ValidationError;
  }

  getResponse(error: ValidationError): { status: number; message: string } {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    };
  }
}

import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { ExceptionStrategy } from '../exception-strategy';

export class UniqueConstraintViolationStrategy implements ExceptionStrategy {
  match(error: Error): boolean {
    return error instanceof UniqueConstraintViolationException;
  }

  getResponse(error: UniqueConstraintViolationException): {
    status: number;
    message: string;
    details: string;
  } {
    return {
      status: HttpStatus.CONFLICT,
      message: 'Duplicate entry. A unique constraint was violated.',
      details: error.message,
    };
  }
}

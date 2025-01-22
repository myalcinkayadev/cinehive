import { NotFoundError } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { ExceptionStrategy } from '../exception-strategy';

export class EntityNotFoundStrategy implements ExceptionStrategy {
  match(error: Error): boolean {
    return error instanceof NotFoundError;
  }

  getResponse(): { status: number; message: string } {
    return {
      status: HttpStatus.NOT_FOUND,
      message: 'Entity not found',
    };
  }
}

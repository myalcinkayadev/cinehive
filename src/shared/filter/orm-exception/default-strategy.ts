import { HttpStatus } from '@nestjs/common';
import { ExceptionStrategy } from './exception-strategy';

export class DefaultStrategy implements ExceptionStrategy {
  match(): boolean {
    return true;
  }

  getResponse(): { status: number; message: string } {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { UserPort } from '../../../movie-management/domain/ports/user.port';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '../../../shared/models/user.model';
import { GetUserQuery } from '../../../shared/queries/get-user.query';

@Injectable()
export class QueryBusUserAdapter implements UserPort {
  constructor(private readonly queryBus: QueryBus) {}

  getUser(userId: string): Promise<User | null> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}

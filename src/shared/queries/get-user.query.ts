import { Query } from '@nestjs/cqrs';
import { User } from '../models/user.model';

export class GetUserQuery extends Query<User | null> {
  constructor(public readonly userId: string) {
    super();
  }
}

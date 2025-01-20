import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../../../shared/queries/get-user.query';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../services/user.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<User> {
    return this.userService.findById(query.userId);
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/user.model';

export const CurrentUser = createParamDecorator<keyof User | undefined>(
  (key, ctx) => {
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();

    const user = request.user;
    if (!user) return undefined;

    return key ? user[key] : user;
  },
);

import { User } from '../../../shared/models/user.model';

export interface UserPort {
  getUser(userId: string): Promise<User | null>;
}

export const USER_PORT = Symbol('UserPort');

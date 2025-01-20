import { User } from './user.entity';

export interface UserRepository {
  nextIdentity(): string;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol('UserRepository');

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../user-management/domain/user.repository';
import { User } from '../../../user-management/domain/user.entity';
import { PasswordHashingService } from './password-hashing.service';
import { UserRole } from '../../../shared/roles/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly hashingService: PasswordHashingService,
  ) {}

  findById(userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  async create(
    username: string,
    password: string,
    age: number,
    role: UserRole,
  ): Promise<User> {
    const hashedPassword = await this.hashingService.hash(password);
    const user = new User(
      this.userRepository.nextIdentity(),
      username,
      hashedPassword,
      age,
      role,
    );
    return this.userRepository.save(user);
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const isValidPassword = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) return null;

    return user;
  }
}

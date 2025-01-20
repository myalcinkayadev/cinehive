import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../../../user-management/domain/user.entity';
import { UserRepository } from '../../../user-management/domain/user.repository';
import { UserPersistence } from '../persistences/user.persistence';
import { UserMapper } from '../mappers/UserMapper';
import { ulid } from 'ulid';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserPersistence)
    private readonly repo: EntityRepository<UserPersistence>,
    private readonly em: EntityManager,
  ) {}

  nextIdentity(): string {
    return ulid();
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.repo.findOne({ id: userId });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.repo.findOne({ username });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const userToPersist = UserMapper.toPersistence(user);
    await this.em.persistAndFlush(userToPersist);
    return user;
  }
}

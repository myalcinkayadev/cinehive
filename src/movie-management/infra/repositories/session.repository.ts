import { Session } from '../../../movie-management/domain/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SessionPersistence } from '../persistences/session.persistence';
import { SessionMapper } from '../mappers/session.mapper';
import { EntityManager } from '@mikro-orm/postgresql';
import { ulid } from 'ulid';

@Injectable()
export class OrmSessionRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionPersistence)
    private readonly repo: EntityRepository<SessionPersistence>,
    private readonly em: EntityManager,
  ) {}

  nextIdentity(): string {
    return ulid();
  }

  async findById(sessionId: string): Promise<Session | null> {
    const session = await this.repo.findOne({ id: sessionId });
    return session ? SessionMapper.toDomain(session) : null;
  }

  async save(session: Session): Promise<void> {
    const sessionToPersist = SessionMapper.toPersistence(session);
    await this.em.persistAndFlush(sessionToPersist);
  }
}

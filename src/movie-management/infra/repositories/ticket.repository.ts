import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../../../movie-management/domain/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketMapper } from '../mappers/ticket.mapper';
import { TicketPersistence } from '../persistences/ticket.persistence';
import { ulid } from 'ulid';

@Injectable()
export class OrmTicketRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketPersistence)
    private readonly repo: EntityRepository<TicketPersistence>,
    private readonly em: EntityManager,
  ) {}

  nextIdentity(): string {
    return ulid();
  }

  async findById(ticketId: string): Promise<Ticket | null> {
    const ticket = await this.repo.findOne({ id: ticketId });
    return ticket ? TicketMapper.toDomain(ticket) : null;
  }

  async save(ticket: Ticket): Promise<void> {
    const ticketToPersist = TicketMapper.toPersistence(ticket);
    await this.em.persistAndFlush(ticketToPersist);
  }
}

import { Ticket } from '../ticket.entity';

export interface TicketRepository {
  nextIdentity(): string;
  findById(ticketId: string): Promise<Ticket | null>;
  save(ticket: Ticket): Promise<void>;
}

export const TICKET_REPOSITORY = Symbol('TicketRepository');

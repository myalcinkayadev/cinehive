import { BuyTicketDto } from '../../../movie-management/application/dtos/buy-ticket.dto';
import { Ticket } from '../../../movie-management/domain/ticket.entity';
import { TicketPersistence } from '../persistences/ticket.persistence';

export class TicketMapper {
  static toDomain(persistence: TicketPersistence): Ticket {
    return new Ticket(
      persistence.id,
      persistence.userId,
      persistence.sessionId,
    );
  }

  static toPersistence(domain: Ticket): TicketPersistence {
    const ticketToPersist = new TicketPersistence();
    ticketToPersist.id = domain.id;
    ticketToPersist.userId = domain.userId;
    ticketToPersist.sessionId = domain.sessionId;
    ticketToPersist.purchasedAt = domain.purchasedAt;
    return ticketToPersist;
  }

  static toDto(domain: Ticket): BuyTicketDto {
    const ticket = new BuyTicketDto();
    ticket.id = domain.id;
    ticket.userId = domain.userId;
    ticket.sessionId = domain.sessionId;
    return ticket;
  }
}

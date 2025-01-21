import { DomainEvent } from '../event';

export class TicketPurchasedEvent implements DomainEvent {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly movieId: string,
    public readonly sessionId: string,
    public readonly purchasedAt: Date,
  ) {}
}

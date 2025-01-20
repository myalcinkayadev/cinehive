// TODO: maybe instead of relations with id, you can use state object inside the event
export class TicketPurchasedEvent {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly movieId: string,
    public readonly sessionId: string,
    public readonly purchasedAt: Date,
  ) {}
}

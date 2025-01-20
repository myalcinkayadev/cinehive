export class TicketNotFoundError extends Error {
  constructor(readonly ticketId: string) {
    super(`Ticket ${ticketId} is not found`);
  }
}

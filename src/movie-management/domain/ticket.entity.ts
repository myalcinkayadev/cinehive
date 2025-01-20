export class Ticket {
  public readonly purchasedAt: Date;

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly sessionId: string,
  ) {
    this.purchasedAt = new Date();
  }
}

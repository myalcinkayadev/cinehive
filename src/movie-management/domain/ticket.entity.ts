import { Entity } from '../../shared/domain/entitiy';

export class Ticket extends Entity {
  public readonly purchasedAt: Date;

  constructor(
    id: string,
    public readonly userId: string,
    public readonly sessionId: string,
  ) {
    super(id);
    this.purchasedAt = new Date();
  }
}

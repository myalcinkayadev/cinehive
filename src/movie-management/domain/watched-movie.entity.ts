import { Entity } from '../../shared/domain/entitiy';

export class WatchedMovie extends Entity {
  public readonly watchedAt: Date;

  constructor(
    id: string,
    public readonly userId: string,
    public readonly movieId: string,
    public readonly ticketId: string,
  ) {
    super(id);
    this.watchedAt = new Date();
  }
}

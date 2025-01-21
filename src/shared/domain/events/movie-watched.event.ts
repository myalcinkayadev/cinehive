import { DomainEvent } from '../event';

export class MovieWatchedEvent implements DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly movieId: string,
    public readonly sessionId: string,
    public readonly watchedAt: Date,
  ) {}
}

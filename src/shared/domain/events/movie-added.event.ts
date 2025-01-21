import { DomainEvent } from '../event';

export class MovieAddedEvent implements DomainEvent {
  constructor(
    public readonly movieId: string,
    public readonly name: string,
    public readonly ageRestriction: number,
    public readonly addedAt: Date,
  ) {}
}

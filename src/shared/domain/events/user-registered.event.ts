import { DomainEvent } from '../event';

export class UserRegisteredEvent implements DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly role: string,
    public readonly registeredAt: Date,
  ) {}
}

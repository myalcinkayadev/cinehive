export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly role: string,
    public readonly registeredAt: Date,
  ) {}
}

export class WatchedMovie {
  public readonly watchedAt: Date;

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly movieId: string,
    public readonly ticketId: string,
  ) {
    this.watchedAt = new Date();
  }
}

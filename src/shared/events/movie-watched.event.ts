export class MovieWatchedEvent {
  constructor(
    public readonly userId: string,
    public readonly movieId: string,
    public readonly sessionId: string,
    public readonly watchedAt: Date,
  ) {}
}

export class MovieAddedEvent {
  constructor(
    public readonly movieId: string,
    public readonly name: string,
    public readonly ageRestriction: number,
    public readonly addedAt: Date,
  ) {}
}

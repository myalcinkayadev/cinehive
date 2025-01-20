export class MovieUpdatedEvent {
  constructor(
    public readonly movieId: string,
    public readonly oldName: string,
    public readonly newName: string,
    public readonly oldAgeRestriction: number,
    public readonly newAgeRestriction: number,
    public readonly updatedAt: Date,
  ) {}
}

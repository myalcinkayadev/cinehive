export class MovieNotFoundError extends Error {
  constructor(readonly movieId: string) {
    super(`Movie ${movieId} is not found`);
  }
}

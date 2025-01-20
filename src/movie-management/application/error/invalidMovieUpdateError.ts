export class InvalidMovieUpdateError extends Error {
  constructor() {
    super('At least one property name or ageRestriction must be provided.');
  }
}

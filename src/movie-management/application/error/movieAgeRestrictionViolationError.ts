export class MovieAgeRestrictionViolationError extends Error {
  constructor() {
    super('User does not meet the age restriction for this movie.');
  }
}

export class UserNotFoundError extends Error {
  constructor(readonly userId: string) {
    super(`User ${userId} is not found`);
  }
}

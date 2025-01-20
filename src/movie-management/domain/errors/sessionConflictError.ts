export class SessionConflictError extends Error {
  constructor() {
    super('The session overlaps with another scheduled session.');
  }
}

export class SessionNotFound extends Error {
  constructor(readonly sessionId: string) {
    super(`Session ${sessionId} is not found`);
  }
}

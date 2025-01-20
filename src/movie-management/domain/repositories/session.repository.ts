import { Session } from '../session.entity';

export interface SessionRepository {
  nextIdentity(): string;
  findById(sessionId: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
}

export const SESSION_REPOSITORY = Symbol('SessionRepository');

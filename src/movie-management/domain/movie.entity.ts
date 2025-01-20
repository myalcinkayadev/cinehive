import { SessionConflictError } from './errors/sessionConflictError';
import { Session } from './session.entity';
import { AgeRestriction } from './value-objects/age-restriction';
import { MovieName } from './value-objects/movie-name';

export class Movie {
  public readonly sessions: Session[] = [];

  constructor(
    public readonly id: string,
    private name: MovieName,
    private ageRestriction: AgeRestriction,
  ) {}

  getMovieName(): MovieName {
    return this.name;
  }

  getAgeRestriction(): AgeRestriction {
    return this.ageRestriction;
  }

  scheduleSession(session: Session): void {
    const isConflict = this.sessions.some((s) => s.conflictsWith(session));
    if (isConflict) {
      throw new SessionConflictError();
    }

    this.sessions.push(session);
  }

  rename(newName: string): void {
    this.name = new MovieName(newName);
  }

  updateAgeRestriction(newAgeRestriction: number): void {
    this.ageRestriction = new AgeRestriction(newAgeRestriction);
  }
}

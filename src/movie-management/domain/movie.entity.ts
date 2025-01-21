import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Entity } from '../../shared/domain/entitiy';
import { SessionConflictError } from './errors/sessionConflictError';
import { Session } from './session.entity';
import { AgeRestriction } from './value-objects/age-restriction';
import { MovieName } from './value-objects/movie-name';

export class Movie extends Entity implements AggregateRoot {
  private _movieName: MovieName;
  private _ageRestriction: AgeRestriction;

  public readonly sessions: Session[] = [];

  constructor(id: string, name: MovieName, ageRestriction: AgeRestriction) {
    super(id);
    this._movieName = name;
    this._ageRestriction = ageRestriction;
  }

  get movieName(): MovieName {
    return this._movieName;
  }

  get ageRestriction(): AgeRestriction {
    return this._ageRestriction;
  }

  scheduleSession(session: Session): void {
    const isConflict = this.sessions.some((s) => s.conflictsWith(session));
    if (isConflict) throw new SessionConflictError();

    this.sessions.push(session);
  }

  rename(newName: string): void {
    this._movieName = new MovieName(newName);
  }

  changeAgeRestriction(newAgeRestriction: number): void {
    this._ageRestriction = new AgeRestriction(newAgeRestriction);
  }
}

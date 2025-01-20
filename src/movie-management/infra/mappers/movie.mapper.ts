import { AgeRestriction } from '../../../movie-management/domain/value-objects/age-restriction';
import { Movie } from '../../../movie-management/domain/movie.entity';
import { MovieName } from '../../../movie-management/domain/value-objects/movie-name';
import { MoviePersistence } from '../persistences/movie.persistence';
import { SessionMapper } from './session.mapper';

export class MovieMapper {
  static toDomain(persistence: MoviePersistence): Movie {
    return new Movie(
      persistence.id,
      new MovieName(persistence.name),
      new AgeRestriction(persistence.ageRestriction),
    );
  }

  static toPersistence(domain: Movie): MoviePersistence {
    const movieToPersist = new MoviePersistence();
    movieToPersist.id = domain.id;
    movieToPersist.name = domain.getMovieName().valueOf();
    movieToPersist.ageRestriction = domain.getAgeRestriction().valueOf();
    domain.sessions.forEach((session) =>
      movieToPersist.sessions.add(SessionMapper.toPersistence(session)),
    );
    return movieToPersist;
  }
}

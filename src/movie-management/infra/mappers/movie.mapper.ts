import { AgeRestriction } from '../../../movie-management/domain/value-objects/age-restriction';
import { Movie } from '../../../movie-management/domain/movie.entity';
import { MovieName } from '../../../movie-management/domain/value-objects/movie-name';
import { MoviePersistence } from '../persistences/movie.persistence';
import { SessionMapper } from './session.mapper';
import { MovieDto } from '../../application/dtos/movie.dto';

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
    movieToPersist.name = domain.name.valueOf();
    movieToPersist.ageRestriction = domain.ageRestriction.valueOf();
    domain.sessions.forEach((session) =>
      movieToPersist.sessions.add(SessionMapper.toPersistence(session)),
    );
    return movieToPersist;
  }

  static toDto(movie: Movie): MovieDto {
    return {
      id: movie.id,
      name: movie.name.valueOf(),
      ageRestriction: movie.ageRestriction.valueOf(),
      sessions: movie.sessions.map(SessionMapper.toDto),
    };
  }
}

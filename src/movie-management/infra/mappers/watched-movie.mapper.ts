import { WatchedMovie } from '../../../movie-management/domain/watched-movie.entity';
import { WatchedMoviePersistence } from '../persistences/watched-movie.persistence';

export class WatchedMovieMapper {
  static toDomain(persistence: WatchedMoviePersistence): WatchedMovie {
    return new WatchedMovie(
      persistence.id,
      persistence.userId,
      persistence.movieId,
      persistence.ticketId,
    );
  }

  static toPersistence(domain: WatchedMovie): WatchedMoviePersistence {
    const watchedMovieToPersist = new WatchedMoviePersistence();
    watchedMovieToPersist.id = domain.id;
    watchedMovieToPersist.userId = domain.userId;
    watchedMovieToPersist.movieId = domain.movieId;
    watchedMovieToPersist.ticketId = domain.ticketId;
    watchedMovieToPersist.watchedAt = domain.watchedAt;
    return watchedMovieToPersist;
  }
}

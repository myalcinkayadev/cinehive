import { WatchedMovie } from '../watched-movie.entity';

export interface WatchedMovieRepository {
  nextIdentity(): string;
  findByUserId(userId: string): Promise<WatchedMovie[]>;
  save(watchedMovie: WatchedMovie): Promise<void>;
}

export const WATCHED_MOVIE_REPOSITORY = Symbol('WatchedMovieRepository');

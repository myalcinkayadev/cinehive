import { Movie } from '../movie.entity';

export interface MovieRepository {
  nextIdentity(): string;
  findById(id: string): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  update(movie: Movie): Promise<void>;
  save(movie: Movie): Promise<void>;
  delete(movieId: string): Promise<void>;
}

export const MOVIE_REPOSITORY = Symbol('MovieRepository');

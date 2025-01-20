import { Movie } from '../../../movie-management/domain/movie.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { MoviePersistence } from '../persistences/movie.persistence';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MovieMapper } from '../mappers/movie.mapper';
import { ulid } from 'ulid';

export class OrmMovieRepository implements MovieRepository {
  constructor(
    @InjectRepository(MoviePersistence)
    private readonly repo: EntityRepository<MoviePersistence>,
    private readonly em: EntityManager,
  ) {}

  nextIdentity(): string {
    return ulid();
  }

  async findById(movieId: string): Promise<Movie | null> {
    const movie = await this.repo.findOne({ id: movieId });
    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findAll(): Promise<Movie[]> {
    const movies = await this.repo.findAll();
    return movies.map(MovieMapper.toDomain);
  }

  async save(movie: Movie): Promise<void> {
    const movieToPersist = MovieMapper.toPersistence(movie);
    await this.em.persistAndFlush(movieToPersist);
  }

  async delete(movieId: string): Promise<void> {
    const movie = await this.repo.findOne({ id: movieId });
    if (movie) {
      await this.em.removeAndFlush(movie);
    }
  }
}

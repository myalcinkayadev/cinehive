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
    const movie = await this.repo.findOne(
      { id: movieId },
      { populate: ['sessions'] },
    );
    return movie ? MovieMapper.toDomain(movie) : null;
  }

  async findAll(): Promise<Movie[]> {
    const movies = await this.repo.findAll({ populate: ['sessions'] });
    return movies.map(MovieMapper.toDomain);
  }

  async update(movie: Movie): Promise<void> {
    const ref = this.em.getReference(MoviePersistence, movie.id);
    ref.name = movie.name.valueOf();
    ref.ageRestriction = movie.ageRestriction.valueOf();
    await this.em.flush();
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

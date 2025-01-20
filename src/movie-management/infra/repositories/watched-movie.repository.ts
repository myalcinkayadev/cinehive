import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { WatchedMovieRepository } from '../../../movie-management/domain/repositories/watch-movie.repository';
import { WatchedMovie } from '../../../movie-management/domain/watched-movie.entity';
import { ulid } from 'ulid';
import { WatchedMoviePersistence } from '../persistences/watched-movie.persistence';
import { WatchedMovieMapper } from '../mappers/watched-movie.mapper';

@Injectable()
export class OrmWatchedMovieRepository implements WatchedMovieRepository {
  constructor(
    @InjectRepository(WatchedMoviePersistence)
    private readonly repo: EntityRepository<WatchedMoviePersistence>,
    private readonly em: EntityManager,
  ) {}

  nextIdentity(): string {
    return ulid();
  }

  async findByUserId(userId: string): Promise<WatchedMovie[]> {
    const watchedMovies = await this.repo.find({ userId });
    return watchedMovies.map(WatchedMovieMapper.toDomain);
  }

  async save(watchedMovie: WatchedMovie): Promise<void> {
    const watchedMovieToPersist =
      WatchedMovieMapper.toPersistence(watchedMovie);
    await this.em.persistAndFlush(watchedMovieToPersist);
  }
}

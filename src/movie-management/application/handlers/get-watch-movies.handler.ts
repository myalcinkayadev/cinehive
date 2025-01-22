import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWatchedMoviesQuery } from '../../../shared/queries/get-watched-movies.query';
import {
  WATCHED_MOVIE_REPOSITORY,
  WatchedMovieRepository,
} from '../../../movie-management/domain/repositories/watched-movie.repository';
import { WatchedMovie } from '../../../shared/models/watched-movie.model';
import { Inject } from '@nestjs/common';

@QueryHandler(GetWatchedMoviesQuery)
export class GetWatchedMoviesQueryHandler
  implements IQueryHandler<GetWatchedMoviesQuery>
{
  constructor(
    @Inject(WATCHED_MOVIE_REPOSITORY)
    private readonly watchedMovieRepository: WatchedMovieRepository,
  ) {}

  async execute(query: GetWatchedMoviesQuery): Promise<WatchedMovie[]> {
    return this.watchedMovieRepository.findByUserId(query.userId);
  }
}

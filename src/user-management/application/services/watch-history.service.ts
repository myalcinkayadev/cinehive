import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { WatchedMovie } from '../../../shared/models/watched-movie.model';
import { GetWatchedMoviesQuery } from '../../../shared/queries/get-watched-movies.query';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly queryBus: QueryBus) {}

  getHistory(userId: string): Promise<WatchedMovie[]> {
    return this.queryBus.execute(new GetWatchedMoviesQuery(userId));
  }
}

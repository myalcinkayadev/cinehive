import { Query } from '@nestjs/cqrs';
import { WatchedMovie } from '../models/watched-movie.model';

export class GetWatchedMoviesQuery extends Query<WatchedMovie[]> {
  constructor(public readonly userId: string) {
    super();
  }
}

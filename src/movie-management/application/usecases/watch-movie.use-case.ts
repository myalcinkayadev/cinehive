import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '../../domain/repositories/ticket.repository';
import { VoidUseCaseHandler } from '../../../shared/usecase/voidUseCaseHandler';
import { WatchMovieDto } from '../dtos/watch-movie.dto';
import { Traceable } from '../../../shared/telemetry/decorator';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';
import { MovieNotFoundError } from '../error/movieNotFoundError';
import { TicketNotFoundError } from '../error/ticketNotFoundError';
import { WatchedMovie } from '../../../movie-management/domain/watched-movie.entity';
import {
  WATCHED_MOVIE_REPOSITORY,
  WatchedMovieRepository,
} from '../../domain/repositories/watched-movie.repository';
import {
  USER_PORT,
  UserPort,
} from '../../../movie-management/domain/ports/user.port';
import { UserNotFoundError } from '../error/userNotFoundError';

@Injectable()
export class WatchMovieUseCase implements VoidUseCaseHandler<WatchMovieDto> {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(USER_PORT)
    private readonly userPort: UserPort,
    @Inject(WATCHED_MOVIE_REPOSITORY)
    private readonly watchedMovieRepository: WatchedMovieRepository,
  ) {}

  @Traceable()
  async execute(useCase: WatchMovieDto): Promise<void> {
    const movie = await this.movieRepository.findById(useCase.movieId);
    if (!movie) throw new MovieNotFoundError(useCase.movieId);

    const ticket = await this.ticketRepository.findById(useCase.ticketId);
    if (!ticket) throw new TicketNotFoundError(useCase.ticketId);

    const user = await this.userPort.getUser(useCase.userId);
    if (!user) throw new UserNotFoundError(useCase.userId);

    const watchedMovie = new WatchedMovie(
      this.watchedMovieRepository.nextIdentity(),
      user.id,
      movie.id,
      ticket.id,
    );

    await this.watchedMovieRepository.save(watchedMovie);
    // Publish MovieWatchedEvent
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { UseCaseHandler } from '../../../shared/usecase/use-case-handler';
import { MovieDto } from '../dtos/movie.dto';
import { Movie } from '../../domain/movie.entity';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';
import { MovieName } from '../../../movie-management/domain/value-objects/movie-name';
import { AgeRestriction } from '../../../movie-management/domain/value-objects/age-restriction';
import { Session } from '../../../movie-management/domain/session.entity';
import { TimeSlot } from '../../../movie-management/domain/value-objects/time-slot';
import { Room } from '../../../movie-management/domain/value-objects/room';
import { Traceable } from '../../../shared/telemetry/decorator';
import {
  SESSION_REPOSITORY,
  SessionRepository,
} from '../../domain/repositories/session.repository';

@Injectable()
export class AddMovieUseCase implements UseCaseHandler<MovieDto, Movie> {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,

    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  @Traceable()
  async execute(useCase: MovieDto): Promise<Movie> {
    const movieToAdd = new Movie(
      this.movieRepository.nextIdentity(),
      new MovieName(useCase.name),
      new AgeRestriction(useCase.ageRestriction),
    );

    useCase.sessions.map((session) =>
      movieToAdd.scheduleSession(
        new Session(
          this.sessionRepository.nextIdentity(),
          movieToAdd.id,
          new Date(session.date),
          new TimeSlot(session.timeSlotStart, session.timeSlotEnd),
          new Room(session.roomName),
        ),
      ),
    );

    await this.movieRepository.save(movieToAdd);

    return movieToAdd;
  }
}

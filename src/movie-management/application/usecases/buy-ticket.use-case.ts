import { Injectable, Inject } from '@nestjs/common';
import { Ticket } from '../../../movie-management/domain/ticket.entity';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '../../domain/repositories/ticket.repository';
import { USER_PORT, UserPort } from '../../domain/ports/user.port';
import { Traceable } from '../../../shared/telemetry/decorator';
import { UseCaseHandler } from '../../../shared/usecase/use-case-handler';
import { BuyTicketDto } from '../dtos/buy-ticket.dto';
import { SessionNotFoundError } from '../error/sessionNotFoundError';
import { UserNotFoundError } from '../error/userNotFoundError';
import { MovieAgeRestrictionViolationError } from '../error/movieAgeRestrictionViolationError';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../../movie-management/domain/repositories/movie.repository';

@Injectable()
export class BuyTicketUseCase implements UseCaseHandler<BuyTicketDto, Ticket> {
  constructor(
    @Inject(USER_PORT)
    private readonly userPort: UserPort,
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  @Traceable()
  async execute(useCase: BuyTicketDto): Promise<Ticket> {
    const user = await this.userPort.getUser(useCase.userId);
    if (!user) throw new UserNotFoundError(useCase.userId);

    const movie = await this.movieRepository.findBySessionId(useCase.sessionId);
    if (!movie || movie.sessions.length === 0)
      throw new SessionNotFoundError(useCase.sessionId);

    const session = movie.sessions[0];
    const movieAgeRestriction = movie.ageRestriction;
    if (!movieAgeRestriction.isAllowedForAge(user.age))
      throw new MovieAgeRestrictionViolationError();

    // TODO: Ticket Already Sold Exception? TicketAlreadySoldError

    const ticket = new Ticket(
      this.ticketRepository.nextIdentity(),
      user.id,
      session.id,
    );
    await this.ticketRepository.save(ticket);
    return ticket;
  }
}

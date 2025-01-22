import { Module } from '@nestjs/common';
import { SessionPersistence } from './infra/persistences/session.persistence';
import { MoviePersistence } from './infra/persistences/movie.persistence';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieController } from './infra/controller/movie.controller';
import { MOVIE_REPOSITORY } from './domain/repositories/movie.repository';
import { OrmMovieRepository } from './infra/repositories/movie.repository';
import { SESSION_REPOSITORY } from './domain/repositories/session.repository';
import { OrmSessionRepository } from './infra/repositories/session.repository';
import { AddMovieUseCase } from './application/usecases/add-movie.use-case';
import { TICKET_REPOSITORY } from './domain/repositories/ticket.repository';
import { OrmTicketRepository } from './infra/repositories/ticket.repository';
import { BuyTicketUseCase } from './application/usecases/buy-ticket.use-case';
import { TicketPersistence } from './infra/persistences/ticket.persistence';
import { UpdateMovieUseCase } from './application/usecases/update-movie.use-case';
import { RetrieveMoviesUseCase } from './application/usecases/retrieve-movies.use-case';
import { DeleteMovieUseCase } from './application/usecases/delete-movie.use-case';
import { OrmWatchedMovieRepository } from './infra/repositories/watched-movie.repository';
import { WATCHED_MOVIE_REPOSITORY } from './domain/repositories/watched-movie.repository';
import { USER_PORT } from './domain/ports/user.port';
import { QueryBusUserAdapter } from './infra/adapters/user.adapter';
import { WatchMovieUseCase } from './application/usecases/watch-movie.use-case';
import { WatchedMoviePersistence } from './infra/persistences/watched-movie.persistence';
import { TicketController } from './infra/controller/ticket.controller';
import { RetrieveMovieUseCase } from './application/usecases/retrieve-movie.use-case';
import { GetWatchedMoviesQueryHandler } from './application/handlers/get-watch-movies.handler';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      MoviePersistence,
      SessionPersistence,
      TicketPersistence,
      WatchedMoviePersistence,
    ]),
  ],
  controllers: [MovieController, TicketController],
  providers: [
    { provide: USER_PORT, useClass: QueryBusUserAdapter },
    { provide: MOVIE_REPOSITORY, useClass: OrmMovieRepository },
    { provide: SESSION_REPOSITORY, useClass: OrmSessionRepository },
    { provide: TICKET_REPOSITORY, useClass: OrmTicketRepository },
    { provide: WATCHED_MOVIE_REPOSITORY, useClass: OrmWatchedMovieRepository },
    GetWatchedMoviesQueryHandler,
    AddMovieUseCase,
    UpdateMovieUseCase,
    RetrieveMoviesUseCase,
    RetrieveMovieUseCase,
    DeleteMovieUseCase,
    BuyTicketUseCase,
    WatchMovieUseCase,
  ],
})
export class MovieManagementModule {}

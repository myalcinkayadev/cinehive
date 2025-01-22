import { Inject, Injectable } from '@nestjs/common';
import { UseCaseHandler } from '../../../shared/usecase/use-case-handler';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/movie.entity';
import { RetrieveMoviesDto } from '../dtos/retrieve-movies.dto';
import { Traceable } from '../../../shared/telemetry/decorator';

@Injectable()
export class RetrieveMoviesUseCase
  implements UseCaseHandler<RetrieveMoviesDto, Movie[]>
{
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
  ) {}

  @Traceable()
  execute(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { UseCaseHandler } from '../../../shared/usecase/use-case-handler';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';
import { Movie } from '../../../movie-management/domain/movie.entity';
import { RetrieveMovieDto } from '../dtos/retrieve-movie.dto';
import { Traceable } from '../../../shared/telemetry/decorator';

@Injectable()
export class RetrieveMovieUseCase
  implements UseCaseHandler<RetrieveMovieDto, Movie[]>
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

import { VoidUseCaseHandler } from '../../../shared/usecase/voidUseCaseHandler';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { Inject, Injectable } from '@nestjs/common';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';
import { MovieNotFoundError } from '../error/movieNotFoundError';
import { InvalidMovieUpdateError } from '../error/invalidMovieUpdateError';
import { Traceable } from '../../../shared/telemetry/decorator';

@Injectable()
export class UpdateMovieUseCase implements VoidUseCaseHandler<UpdateMovieDto> {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
  ) {}

  @Traceable()
  async execute(useCase: UpdateMovieDto): Promise<void> {
    if (!useCase.name && useCase.ageRestriction === undefined) {
      throw new InvalidMovieUpdateError();
    }

    const movie = await this.movieRepository.findById(useCase.id);
    if (!movie) throw new MovieNotFoundError(useCase.id);

    if (useCase.name) {
      movie.rename(useCase.name);
    }

    if (useCase.ageRestriction !== undefined) {
      movie.changeAgeRestriction(useCase.ageRestriction);
    }

    await this.movieRepository.update(movie);
  }
}

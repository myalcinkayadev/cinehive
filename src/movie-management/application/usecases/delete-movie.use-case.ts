import { VoidUseCaseHandler } from '../../../shared/usecase/voidUseCaseHandler';
import { DeleteMovieDto } from '../dtos/delete-movie.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Traceable } from '../../../shared/telemetry/decorator';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../domain/repositories/movie.repository';

@Injectable()
export class DeleteMovieUseCase implements VoidUseCaseHandler<DeleteMovieDto> {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
  ) {}

  @Traceable()
  async execute(useCase: DeleteMovieDto): Promise<void> {
    await this.movieRepository.delete(useCase.id);
  }
}

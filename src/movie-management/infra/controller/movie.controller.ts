import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { UserRole } from '../../../shared/roles/user-role.enum';
import { AddMovieDto } from '../../../movie-management/application/dtos/add-movie.dto';
import { UpdateMovieDto } from '../../../movie-management/application/dtos/update-movie.dto';
import { WatchMovieDto } from '../../../movie-management/application/dtos/watch-movie.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { AddMovieUseCase } from '../../../movie-management/application/usecases/add-movie.use-case';
import { RetrieveMovieUseCase } from '../../../movie-management/application/usecases/retrieve-movie.use-case';
import { UpdateMovieUseCase } from '../../../movie-management/application/usecases/update-movie.use-case';
import { DeleteMovieUseCase } from '../../../movie-management/application/usecases/delete-movie.use-case';
import { WatchMovieUseCase } from '../../../movie-management/application/usecases/watch-movie.use-case';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly addMovieUseCase: AddMovieUseCase,
    private readonly retrieveMovieUseCase: RetrieveMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
    private readonly watchMovieUseCase: WatchMovieUseCase,
  ) {}

  @Post()
  @Auth(UserRole.Manager)
  @ApiOperation({ summary: 'Add a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully added.',
  })
  @ApiResponse({ status: 400 })
  async addMovie(@Body() addMovieDto: AddMovieDto) {
    return this.addMovieUseCase.execute(addMovieDto);
  }

  @Get()
  @Auth(UserRole.Manager, UserRole.Customer)
  @ApiOperation({ summary: 'Retrieve all movies' })
  @ApiResponse({ status: 200, description: 'List of all movies.' })
  async retrieveMovies() {
    return this.retrieveMovieUseCase.execute();
  }

  @Patch(':id')
  @Auth(UserRole.Manager)
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', description: 'The ID of the movie to update' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.updateMovieUseCase.execute({
      id,
      ...updateMovieDto,
    });
  }

  @Delete(':id')
  @Auth(UserRole.Manager)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiParam({ name: 'id', description: 'The ID of the movie to delete' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async deleteMovie(@Param('id') id: string) {
    return this.deleteMovieUseCase.execute({ id });
  }

  @Post(':id/watch')
  @Auth(UserRole.Customer)
  @ApiOperation({ summary: 'Watch a movie' })
  @ApiParam({ name: 'id', description: 'The ID of the movie to watch' })
  @ApiResponse({ status: 200, description: 'Movie watched successfully.' })
  @ApiResponse({ status: 400 })
  async watchMovie(
    @Param('id') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() watchMovieDto: WatchMovieDto,
  ) {
    return this.watchMovieUseCase.execute({
      userId,
      movieId,
      ...watchMovieDto,
    });
  }
}

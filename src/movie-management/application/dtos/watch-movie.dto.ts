import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WatchMovieDto {
  @ApiHideProperty()
  userId!: string;

  @ApiHideProperty()
  movieId!: string;

  @IsString()
  @ApiProperty({
    description:
      'The unique identifier of the ticket associated with the movie session',
  })
  ticketId!: string;
}

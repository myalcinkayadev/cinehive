import { ApiHideProperty } from '@nestjs/swagger';

export class DeleteMovieDto {
  @ApiHideProperty()
  id!: string;
}

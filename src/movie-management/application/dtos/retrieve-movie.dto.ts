import { ApiHideProperty } from '@nestjs/swagger';

export class RetrieveMovieDto {
  @ApiHideProperty()
  id!: string;
}

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateMovieDto {
  @ApiHideProperty()
  id!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The updated name of the movie',
    example: 'Rear Window',
  })
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The updated age restriction for the movie',
    example: 13,
    minimum: 0,
  })
  ageRestriction?: number;
}

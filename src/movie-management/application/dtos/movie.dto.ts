import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class MovieDto {
  @ApiHideProperty()
  id?: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the movie',
    example: 'Barry Lyndon',
  })
  name!: string;

  @IsInt()
  @ApiProperty({
    description: 'Minimum age restriction for the movie',
    example: 13,
  })
  ageRestriction!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  @ApiProperty({
    description: 'List of sessions for the movie',
    type: () => [SessionDto],
  })
  sessions!: SessionDto[];
}

export class SessionDto {
  @IsString()
  @ApiProperty({
    description: 'Date of the session (in YYYY-MM-DD format)',
    example: '2025-01-20',
  })
  date!: string;

  @IsString()
  @ApiProperty({
    description: 'Start time of the session (in HH:mm format)',
    example: '14:00',
  })
  timeSlotStart!: string;

  @ApiProperty({
    description: 'End time of the session (in HH:mm format)',
    example: '16:00',
  })
  @IsString()
  timeSlotEnd!: string;

  @IsString()
  @ApiProperty({
    description: 'Name of the room where the session will be held',
    example: 'Room A',
  })
  roomName!: string;
}

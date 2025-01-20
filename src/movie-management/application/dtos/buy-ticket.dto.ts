import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BuyTicketDto {
  @ApiHideProperty()
  userId!: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'The unique identifier of the session for which the ticket is being bought',
  })
  sessionId!: string;
}

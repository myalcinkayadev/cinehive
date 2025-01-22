import { Body, Controller, Post } from '@nestjs/common';
import { BuyTicketDto } from '../../application/dtos/buy-ticket.dto';
import { BuyTicketUseCase } from '../../application/usecases/buy-ticket.use-case';
import { UserRole } from '../../../shared/roles/user-role.enum';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketMapper } from '../mappers/ticket.mapper';

@Controller('tickets')
export class TicketController {
  constructor(private readonly buyTicketUseCase: BuyTicketUseCase) {}

  @Post()
  @Auth(UserRole.Customer)
  @ApiOperation({
    summary: 'Buy a ticket',
    description:
      'Allows a customer to buy a ticket for a specific movie session.',
  })
  @ApiResponse({
    status: 201,
    description: 'The ticket has been successfully purchased.',
  })
  @ApiResponse({
    status: 400,
  })
  async buyTicket(
    @CurrentUser('id') userId: string,
    @Body() buyTicketDto: BuyTicketDto,
  ) {
    const purchasedTicket = await this.buyTicketUseCase.execute({
      userId,
      ...buyTicketDto,
    });
    return TicketMapper.toDto(purchasedTicket);
  }
}

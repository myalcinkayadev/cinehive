import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { UserRole } from '../../../shared/roles/user-role.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  @Auth()
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile of the currently authenticated user.',
  })
  async profile(@CurrentUser() currentUser) {
    return currentUser;
  }

  @Auth(UserRole.Customer)
  @Get('profile/watch-history')
  @ApiOperation({
    summary: 'Get watch history',
    description: 'Returns the watch history',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the watch history.',
  })
  async watchHistory() {
    return [];
    // TODO: use command bus to isolate user context from other context
  }
}

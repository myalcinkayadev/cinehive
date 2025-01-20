import { Post, Body, Controller, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { Traceable } from '../../shared/telemetry/decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user and return an access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials. Authentication failed.',
  })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user in the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({
    status: 400,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}

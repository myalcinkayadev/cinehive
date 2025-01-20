import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UserService } from '../../user-management/application/services/user.service';

export type SignInResult = {
  access_token: string;
};

export type SignUpResult = {
  id: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(signInDto: LoginDto): Promise<SignInResult> {
    const user = await this.userService.validate(
      signInDto.username,
      signInDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    await this.userService.create(
      signUpDto.username,
      signUpDto.password,
      signUpDto.age,
      signUpDto.role,
    );
  }
}

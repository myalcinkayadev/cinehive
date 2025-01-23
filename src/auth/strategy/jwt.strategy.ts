import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UserService } from '../../user-management/application/services/user.service';
import { User } from '../../shared/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(_: Request, payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);

    if (!user) throw new Error('User could not be found.');

    return {
      id: payload.sub,
      username: payload.username,
      age: user.age,
      role: user.role,
    };
  }
}

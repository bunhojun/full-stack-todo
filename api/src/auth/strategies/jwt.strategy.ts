import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { JWTPayload } from '@/auth/types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_AT_SECRET'),
    });
  }

  /**
   * @param payload decoded JWT token. See auth.service.ts createToken() method for how it's generated.
   * */
  async validate(payload: JWTPayload) {
    return this.usersService.findOneUser(payload.id);
  }
}

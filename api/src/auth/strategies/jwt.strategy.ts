import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_RT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}

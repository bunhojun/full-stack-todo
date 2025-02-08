import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JWTPayload } from '@/auth/types/jwt-payload.type';

@Injectable()
export class MockJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: () => 'mockToken',
      ignoreExpiration: false,
      secretOrKey: 'mockSecret',
    });
  }

  async validate(payload: JWTPayload) {
    return { userId: payload.id, username: payload.email };
  }
}

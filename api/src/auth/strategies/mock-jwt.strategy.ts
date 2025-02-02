import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class MockJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: () => 'mockToken',
      ignoreExpiration: false,
      secretOrKey: 'mockSecret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

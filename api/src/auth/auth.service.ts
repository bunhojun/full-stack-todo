import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserWithoutPassword } from '@/users/types/user-without-password.type';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from '@/auth/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOneByEmailForAuth(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return this.usersService.findOneUser(user.id);
    }
    return null;
  }

  async createToken(user: { email: string; id: number }) {
    const payload: JWTPayload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_AT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_AT_EXPIRES_IN'),
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_RT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_RT_EXPIRES_IN'),
      }),
    };
  }
}

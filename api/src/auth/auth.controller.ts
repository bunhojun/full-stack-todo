import {
  Request,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/auth/decorators/public.decorator';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { SignInDto } from '@/dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh-auth.guard';
import { UserWithoutPasswordType } from '@/users/types/user-without-password.type';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard) // check the user credentials
  @Post('login')
  async signIn(
    @Body() _signInDto: SignInDto,
    @Request() req: { user: UserWithoutPasswordType }, // The user object is attached to the request object after LocalAuthGuard validation
    @Res({
      passthrough: true, // This option is necessary to set cookies in the response
    })
    response: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.createToken(
      req.user,
    );
    const options = {
      httpOnly: this.configService.get<boolean>('COOKIE_HTTPONLY'),
      secure: this.configService.get<boolean>('COOKIE_SECURE'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    };
    response
      .cookie('access_token', access_token, {
        ...options,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      })
      .cookie('refresh_token', refresh_token, {
        ...options,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .json(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Request() req: { user: UserWithoutPasswordType }, // The user object is attached to the request object after JwtRefreshAuthGuard validation
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.createToken(
      req.user,
    );
    const options = {
      httpOnly: this.configService.get<boolean>('COOKIE_HTTPONLY'),
      secure: this.configService.get<boolean>('COOKIE_SECURE'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    };
    response
      .cookie('access_token', access_token, {
        ...options,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      })
      .cookie('refresh_token', refresh_token, {
        ...options,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .json(req.user);
  }

  @Post('logout')
  signOut(@Res({ passthrough: true }) response: Response) {
    response
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(HttpStatus.NO_CONTENT);
  }
}

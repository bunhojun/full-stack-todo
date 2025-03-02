import {
  Request,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/auth/decorators/public.decorator';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh-auth.guard';
import { UserWithoutPassword } from '@/users/types/user-without-password.type';
import { UserAgent } from '@/auth/decorators/user-agent.decorator';
import { UAParser } from 'ua-parser-js';

const createOptions = (userAgent: string, configService: ConfigService) => {
  const defaultOptions = {
    httpOnly: configService.get('COOKIE_HTTPONLY') === 'true',
    secure: configService.get('COOKIE_SECURE') === 'true',
    sameSite: configService.get('COOKIE_SAME_SITE'),
    domain: configService.get('COOKIE_DOMAIN'),
  };
  if (configService.get('ENVIRONMENT') === 'local') {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();

    switch (browser.name) {
      case 'Safari':
        return {
          httpOnly: configService.get('COOKIE_HTTPONLY') === 'true',
          secure: configService.get('LOCAL_COOKIE_SAFARI_SECURE') === 'true',
          sameSite: configService.get('COOKIE_SAME_SITE'),
          domain: configService.get('COOKIE_DOMAIN'),
        };
      default:
        return defaultOptions;
    }
  }

  return defaultOptions;
};

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getAuthedUser(
    @Request() req: { user: UserWithoutPassword }, // The user will be attached to the request object after the JwtAuthGuard validation
  ): UserWithoutPassword {
    return req.user;
  }

  @Public()
  @UseGuards(LocalAuthGuard) // check the user credentials
  @Post('login')
  async signIn(
    @Body() _signInDto: SignInDto,
    @UserAgent() userAgent: string,
    @Request() req: { user: UserWithoutPassword }, // The user object is attached to the request object after LocalAuthGuard validation
    @Res({
      passthrough: true, // This option is necessary to set cookies in the response
    })
    response: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.createToken(
      req.user,
    );
    const options = createOptions(userAgent, this.configService);
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
    @Request() req: { user: UserWithoutPassword }, // The user object is attached to the request object after JwtRefreshAuthGuard validation
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.createToken(
      req.user,
    );
    const options = createOptions(userAgent, this.configService);
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

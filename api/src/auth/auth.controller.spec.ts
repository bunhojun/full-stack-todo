import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          envFilePath: ['.env.test'],
          cache: true,
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

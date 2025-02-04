import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { buildTestDataSource, seederOptions } from './setup';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from '@/auth/guards/mock.guard';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { MockJwtStrategy } from '@/auth/strategies/mock-jwt.strategy';
import { runSeeders } from 'typeorm-extension';
import * as request from 'supertest';
import { User } from '@/users/entities/user.entity';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testDataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          envFilePath: ['.env.test'],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            testDataSource = await buildTestDataSource(configService);
            return {
              ...testDataSource.options,
            };
          },
          inject: [ConfigService],
        }),
        AuthModule,
      ],
      controllers: [],
      providers: [],
    })
      .overrideProvider(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.use(cookieParser());

    await app.init();
    await runSeeders(testDataSource, {
      ...seederOptions,
      // add one when necessary
      // seeds: [],
    });
  });

  afterAll(async () => {
    await app.close();
    await testDataSource.destroy();
  });

  describe('auth', () => {
    it('POST: /auth/login', async () => {
      const newUser = new User();
      newUser.email = 'sdfasd@example.com';
      newUser.name = 'Random user';
      newUser.role = 'normal';
      newUser.password = 'password';
      const user = await testDataSource
        .createEntityManager()
        .save(User, newUser);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'sdfasd@example.com',
          password: 'password',
        })
        .expect('set-cookie', /access_token/);
      const authedUser = response.body;
      expect(authedUser.id).toBe(user.id);
    });

    it('POST: /auth/logout', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});

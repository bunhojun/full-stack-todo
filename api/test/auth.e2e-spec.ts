import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { buildTestDataSource, seederOptions } from './setup';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
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
    }).compile();

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

  const createUser = async (email: string): Promise<User> => {
    const newUser = new User();
    newUser.email = email;
    newUser.name = 'Random user';
    newUser.role = 'normal';
    newUser.password = 'password';
    return testDataSource.createEntityManager().save(User, newUser);
  };

  const login = async (email: string) => {
    const newUser = await createUser(email);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: newUser.email,
        password: 'password',
      });
    return { accessToken: response.header['set-cookie'][0], user: newUser };
  };

  describe('auth', () => {
    it('GET: /auth', async () => {
      const { user, accessToken } = await login('sdca@cdsa.com');
      const response = await request(app.getHttpServer())
        .get('/auth')
        .set('Cookie', accessToken);
      expect(response.body.id).toBe(user.id);
    });

    it('POST: /auth/login', async () => {
      const user = await createUser('sdfasd@example.com');
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'password',
        });
      const accessToken = response.header['set-cookie'][0];
      const refreshToken = response.header['set-cookie'][1];
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      const authedUser = response.body;
      expect(authedUser.id).toBe(user.id);
    });

    it('POST: /auth/refresh', async () => {
      const user = await createUser('sdfasdaa@example.com');
      // need to sign in first to get refresh token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'password',
        });
      const loginRefreshToken = loginResponse.header['set-cookie'][1];
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', loginRefreshToken);
      const accessToken = response.header['set-cookie'][0];
      const refreshToken = response.header['set-cookie'][1];
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      const authedUser = response.body;
      expect(authedUser.id).toBe(user.id);
    });

    it('POST: /auth/logout', async () => {
      const user = await createUser('hasfhd@example.com');
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'password',
        });
      const accessToken = loginResponse.header['set-cookie'][0];
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', accessToken)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('jwt auth guard', () => {
    it('GET: /users', async () => {
      // check if it fails first
      await request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
      // then, check if it passes
      const { accessToken } = await login('vfeavfs@example.com');
      await request(app.getHttpServer())
        .get('/users')
        .set('Cookie', accessToken)
        .expect(HttpStatus.OK);
    });
  });
});

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { runSeeders } from 'typeorm-extension';
import { buildTestDataSource, seederOptions } from './setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { User } from '@/users/entities/user.entity';
import { AuthModule } from '@/auth/auth.module';
import { MockAuthGuard } from '@/auth/guards/mock.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { MockJwtStrategy } from '@/auth/strategies/mock-jwt.strategy';

describe('UsersController (e2e)', () => {
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
        UsersModule,
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

  describe('users', () => {
    it('POST: /users', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          role: 'normal',
          password: 'password',
        })
        .expect(201);
      const newUser = res.body;
      expect(newUser).toHaveProperty('id');
      expect(newUser.email).toEqual('test@example.com');
      expect(newUser.name).toEqual('Test User');
      expect(newUser.role).toEqual('normal');
      // make sure password is not returned
      expect(newUser).not.toHaveProperty('password');
    });

    it('GET: /users', async () => {
      // add users
      await testDataSource.createEntityManager().save(User, {
        email: 'awesdfa@example.com',
        name: 'Random user1',
        role: 'normal',
        password: 'password',
      });
      await testDataSource.createEntityManager().save(User, {
        email: 'vfdsafdva@example.com',
        name: 'Random user2',
        role: 'normal',
        password: 'password',
      });
      const length = await testDataSource.createEntityManager().count(User);
      const res = await request(app.getHttpServer()).get('/users').expect(200);
      expect(res.body).toHaveLength(length);
    });

    it('GET: /users/:id', async () => {
      const user = await testDataSource.createEntityManager().save(User, {
        email: 'sdfacsd@example.com',
        name: 'Random user',
        role: 'normal',
        password: 'password',
      });
      const res = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);
      expect(res.body.email).toEqual(user.email);
      expect(res.body.name).toEqual(user.name);
      expect(res.body.role).toEqual(user.role);
      // make sure password is not returned
      expect(res.body).not.toHaveProperty('password');
    });

    it('PATCH: /users/:id', async () => {
      const user = await testDataSource.createEntityManager().save(User, {
        email: 'sdfasd@example.com',
        name: 'Random user',
        role: 'normal',
        password: 'password',
      });
      const res = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send({
          name: 'Updated name',
        })
        .expect(200);
      expect(res.body.email).toEqual(user.email);
      expect(res.body.name).toEqual('Updated name');
      expect(res.body.role).toEqual(user.role);
    });

    it('DELETE: /users/:id', async () => {
      const user = await testDataSource.createEntityManager().save(User, {
        email: 'fawsd@example.com',
        name: 'Random user',
        role: 'normal',
        password: 'password',
      });
      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(204);
      const deletedUser = await testDataSource
        .createEntityManager()
        .findOne(User, {
          where: {
            id: user.id,
          },
        });
      expect(deletedUser).toBeNull();
    });
  });
});

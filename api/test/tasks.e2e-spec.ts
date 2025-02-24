import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTestDataSource, seederOptions } from './setup';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from '@/auth/guards/mock.guard';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { MockJwtStrategy } from '@/auth/strategies/mock-jwt.strategy';
import { runSeeders } from 'typeorm-extension';
import { TasksModule } from '@/tasks/tasks.module';
import * as request from 'supertest';
import { Task } from '@/tasks/entities/task.entity';

describe('TasksController (e2e)', () => {
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
        TasksModule,
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

  describe('Tasks', () => {
    it('POST: /tasks', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          content: 'Test task',
          authorId: 1,
        })
        .expect(HttpStatus.CREATED);
      expect(res.body.content).toBe('Test task');
      expect(res.body.authorId).toBe(1);
    });

    it('GET: /tasks/:id', async () => {
      const task = await testDataSource.createEntityManager().save(Task, {
        content: 'Test task',
        authorId: 1,
      });
      const res = await request(app.getHttpServer()).get(`/tasks/${task.id}`);
      expect(res.body.id).toBe(task.id);
    });

    it('PATCH: /tasks/:id', async () => {
      const task = await testDataSource.createEntityManager().save(Task, {
        content: 'Test task',
        authorId: 1,
      });
      const res = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          content: 'Updated task',
        });
      expect(res.body.content).toBe('Updated task');
    });

    it('GET: /tasks', async () => {
      // add multiple tasks
      const task1 = await testDataSource.createEntityManager().save(Task, {
        content: 'Test task 1',
        authorId: 1,
      });
      const task2 = await testDataSource.createEntityManager().save(Task, {
        content: 'Test task 2',
        authorId: 2,
      });
      const tasks = await testDataSource.createEntityManager().find(Task);
      expect(tasks.length).toBeGreaterThanOrEqual(2);
      const res = await request(app.getHttpServer()).get('/tasks');
      expect(res.body.length).toBeGreaterThanOrEqual(tasks.length);
      expect(res.body.find((e: Task) => e.id === task1.id)).toBeTruthy();
      expect(res.body.find((e: Task) => e.id === task2.id)).toBeTruthy();
    });

    it('DELETE: /tasks/:id', async () => {
      const task = await testDataSource.createEntityManager().save(Task, {
        content: 'Test task',
        authorId: 1,
      });
      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(HttpStatus.NO_CONTENT);
      const tasks = await testDataSource.createEntityManager().find(Task);
      expect(tasks.find((e: Task) => e.id === task.id)).toBeFalsy();
    });
  });
});

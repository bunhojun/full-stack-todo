import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTestDataSource, seederOptions } from './setup';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from '@/auth/guards/mock.guard';

describe('AppController (e2e)', () => {
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
      ],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(JwtAuthGuard)
      .useClass(MockAuthGuard)
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

  describe('root', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });
});

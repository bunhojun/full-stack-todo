import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);
  app.enableCors({
    origin: configService.get('CORS_ORIGIN').split(','),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser()); // this adds cookies to the request object

  // swagger
  const config = new DocumentBuilder()
    .setTitle('my todo API docs')
    .setDescription('no description')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' },
  });

  await dataSource.runMigrations();

  await app.listen(3000);
}
(async () => {
  await bootstrap();
})();

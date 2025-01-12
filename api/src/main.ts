import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

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
  await app.listen(3000);
}
(async () => {
  await bootstrap();
  console.log('Server started');
})();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dotenv.config();
dayjs.extend(utc);

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, ClientPath, Authorization',
    credentials: true,
  });
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('REM User Data')
    .setDescription('Deskripsi API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(bodyParser.json({ limit: '30mb' }));
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port : ${process.env.PORT}`);
    console.log(`Server date: ${new Date()}`);
  });
}
bootstrap();

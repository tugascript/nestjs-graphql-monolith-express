import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { altairExpress } from 'altair-express-middleware';
import cookieParser from 'cookie-parser';
import { json, static as staticExpress } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { IUploadOptions } from './config/interfaces/upload-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: configService.get<string>('url'),
  });
  app.use(json());
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  app.use(staticExpress(join(__dirname, '..', 'public')));
  const { default: graphqlUploadExpress } = await import(
    'graphql-upload/graphqlUploadExpress.mjs'
  );
  app.use(graphqlUploadExpress(configService.get<IUploadOptions>('upload')));

  if (configService.get<boolean>('testing')) {
    app.use(
      '/altair',
      altairExpress({
        endpointURL: '/api/graphql',
      }),
    );
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<number>('port'));
}

bootstrap();

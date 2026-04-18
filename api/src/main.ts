import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { raw, Request } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const dbEnabled = process.env.ENABLE_DATABASE === 'true';
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  if (!dbEnabled) {
    // TODO(db): definir ENABLE_DATABASE=true + DATABASE_URL para reativar PostgreSQL.
    console.log('[bootstrap] PostgreSQL desativado: API iniciada com armazenamento em memória.');
  }

  app.use(
    '/payments/stripe/webhook',
    raw({
      type: 'application/json',
      verify: (req: Request & { rawBody?: Buffer }, _res, buf) => {
        req.rawBody = Buffer.from(buf);
      },
    }),
  );

  const configuredOrigins = [
    ...(process.env.CORS_ORIGINS || '').split(','),
    process.env.FRONTEND_URL || '',
  ]
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (configuredOrigins.includes('*')) return callback(null, true);
      if (configuredOrigins.includes(normalizedOrigin)) return callback(null, true);

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin);
      const isPrivateNetworkIp = /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)(\d+\.\d+)(:\d+)?$/i.test(
        normalizedOrigin,
      );

      if (isLocalhost || isPrivateNetworkIp) return callback(null, true);

      return callback(new Error('Origem não permitida por CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
}

bootstrap();

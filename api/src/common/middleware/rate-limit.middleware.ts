import {
  Injectable,
  NestMiddleware,
  HttpException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type CounterEntry = { count: number; resetAt: number };

const bucket = new Map<string, CounterEntry>();
const WINDOW_MS = 60_000;
const LIMIT_PER_WINDOW = 120;

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown');
    const now = Date.now();
    const current = bucket.get(ip);

    if (!current || current.resetAt < now) {
      bucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      next();
      return;
    }

    if (current.count >= LIMIT_PER_WINDOW) {
      throw new HttpException('Limite de requisições excedido. Tente novamente em instantes.', 429);
    }

    current.count += 1;
    next();
  }
}

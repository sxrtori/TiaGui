import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyAccessToken } from './token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = String(request.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';

    if (!token) {
      throw new UnauthorizedException('Token ausente');
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    request.user = payload;
    return true;
  }
}

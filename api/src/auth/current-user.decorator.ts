import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './token.util';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPayload | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || null;
  },
);

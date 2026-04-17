import { createHmac, timingSafeEqual } from 'crypto';

const header = { alg: 'HS256', typ: 'JWT' };

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(input: string, secret: string): string {
  return createHmac('sha256', secret).update(input).digest('base64url');
}

export type TokenPayload = {
  sub: number;
  email: string;
  tipo_usuario: string;
  exp: number;
};

export function generateAccessToken(
  payload: Omit<TokenPayload, 'exp'>,
  expiresInSeconds = 60 * 60 * 8,
): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body: TokenPayload = { ...payload, exp };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, getSecret());

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, getSecret());

  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length) return null;

  const valid = timingSafeEqual(received, expected);
  if (!valid) return null;

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as TokenPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

function getSecret(): string {
  return process.env.AUTH_TOKEN_SECRET || 'sportx-dev-secret';
}

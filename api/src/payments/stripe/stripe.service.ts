import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';

type StripeCheckoutSessionResponse = {
  id: string;
  url: string;
};

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured() {
    return Boolean(this.configService.get<string>('STRIPE_SECRET_KEY'));
  }

  async createGiftCardCheckoutSession(payload: {
    giftCardId: number;
    valor: number;
    nomeDestinatario: string;
    emailDestinatario: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<StripeCheckoutSessionResponse> {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new Error('Pagamento indisponível no momento.');
    }

    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', payload.successUrl);
    params.set('cancel_url', payload.cancelUrl);
    params.set('customer_email', payload.emailDestinatario);
    params.set('metadata[giftCardId]', String(payload.giftCardId));
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'brl');
    params.set('line_items[0][price_data][unit_amount]', String(Math.round(Number(payload.valor || 0) * 100)));
    params.set('line_items[0][price_data][product_data][name]', `Gift Card SportX - ${payload.nomeDestinatario}`);
    params.set('line_items[0][price_data][product_data][description]', 'Gift card digital SportX');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`Falha ao criar sessão Stripe: ${details}`);
      throw new Error('Não foi possível criar a sessão de pagamento.');
    }

    const session = (await response.json()) as StripeCheckoutSessionResponse;
    return session;
  }

  verifyWebhookSignature(payload: Buffer, signatureHeader: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.warn('STRIPE_WEBHOOK_SECRET não configurado. Webhook ignorado.');
      throw new Error('Webhook secret não configurado.');
    }

    const tokens = signatureHeader
      .split(',')
      .map((item) => item.trim())
      .reduce<Record<string, string>>((acc, item) => {
        const [key, value] = item.split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {});

    const timestamp = tokens.t;
    const expected = tokens.v1;
    if (!timestamp || !expected) throw new Error('Assinatura Stripe inválida.');

    const signedPayload = `${timestamp}.${payload.toString('utf8')}`;
    const digest = createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'hex');
    const digestBuffer = Buffer.from(digest, 'hex');

    if (
      expectedBuffer.length !== digestBuffer.length ||
      !timingSafeEqual(expectedBuffer, digestBuffer)
    ) {
      throw new Error('Assinatura Stripe inválida.');
    }

    return JSON.parse(payload.toString('utf8')) as {
      type: string;
      data: { object: Record<string, unknown> };
    };
  }
}

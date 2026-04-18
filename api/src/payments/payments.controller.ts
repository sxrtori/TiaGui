import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { GiftCardsService } from '../gift-cards/gift-cards.service';
import { StripeService } from './stripe/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly giftCardsService: GiftCardsService,
  ) {}

  @Post('stripe/webhook')
  @HttpCode(200)
  async stripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature || !req.rawBody) {
      return { received: false };
    }

    const event = this.stripeService.verifyWebhookSignature(req.rawBody, signature);

    if (event.type === 'checkout.session.completed') {
      await this.giftCardsService.processarPagamentoConfirmado(event.data.object, event.id);
    }

    return { received: true };
  }
}

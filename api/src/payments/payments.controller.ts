import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GiftCardsService } from '../gift-cards/gift-cards.service';
import { PagamentosService } from '../pagamentos/pagamentos.service';
import { PedidosService } from '../pedidos/pedidos.service';
import { StripeService } from './stripe/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly giftCardsService: GiftCardsService,
    private readonly pedidosService: PedidosService,
    private readonly pagamentosService: PagamentosService,
  ) {}

  @Post('stripe/payment-intent')
  async createStripePaymentIntent(@Body('pedidoId') pedidoId: number) {
    const id = Number(pedidoId);
    if (!Number.isFinite(id) || id <= 0) {
      throw new BadRequestException('pedidoId inválido.');
    }

    const pedido = await this.pedidosService.findOne(id);

    if (String(pedido.forma_pagamento).toLowerCase() !== 'cartao') {
      throw new BadRequestException(
        'PaymentIntent disponível apenas para pagamento com cartão.',
      );
    }

    const paymentIntent = await this.stripeService.createOrderPaymentIntent({
      pedidoId: pedido.id_pedido,
      amount: Number(pedido.total),
      currency: 'brl',
    });

    const pagamento = await this.pagamentosService.create({
      id_usuario: pedido.id_usuario,
      tipo: 'cartao',
      token_gateway: paymentIntent.id,
      status: paymentIntent.status || 'pendente',
    });

    await this.pedidosService.update(pedido.id_pedido, {
      id_pagamento: pagamento.id_pagamento,
    });

    return {
      pedidoId: pedido.id_pedido,
      stripePaymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      publicKey: this.stripeService.getPublicKey(),
    };
  }

  @Post('stripe/webhook')
  @HttpCode(200)
  async stripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature || !req.rawBody) {
      return { received: false };
    }

    const event = this.stripeService.verifyWebhookSignature(
      req.rawBody,
      signature,
    );

    if (event.type === 'checkout.session.completed') {
      await this.giftCardsService.processarPagamentoConfirmado(
        event.data.object,
        event.id,
      );
    }

    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'payment_intent.payment_failed'
    ) {
      const stripeObject = event.data.object as {
        id?: string;
        metadata?: Record<string, string>;
      };
      const intentId = String(stripeObject.id || '');
      const pedidoId = Number(stripeObject.metadata?.pedidoId || 0);

      if (!intentId || !pedidoId) {
        throw new NotFoundException('Metadados do pagamento inválidos.');
      }

      const pedido = await this.pedidosService.findOne(pedidoId);
      const statusPagamento =
        event.type === 'payment_intent.succeeded' ? 'aprovado' : 'recusado';
      const statusPedido =
        event.type === 'payment_intent.succeeded' ? 'pago' : 'pendente';

      if (pedido.id_pagamento) {
        await this.pagamentosService.update(pedido.id_pagamento, {
          token_gateway: intentId,
          status: statusPagamento,
        });
      }

      await this.pedidosService.update(pedido.id_pedido, {
        status: statusPedido,
      });
    }

    return { received: true };
  }
}

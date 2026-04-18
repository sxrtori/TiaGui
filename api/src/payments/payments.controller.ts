import {
  ConflictException,
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
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

    if (pedido.id_pagamento) {
      throw new ConflictException(
        'PaymentIntent já foi iniciado para este pedido.',
      );
    }

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

  @Post('pix/charge')
  async createPixCharge(@Body('pedidoId') pedidoId: number) {
    const id = Number(pedidoId);
    if (!Number.isFinite(id) || id <= 0) {
      throw new BadRequestException('pedidoId inválido.');
    }

    const pedido = await this.pedidosService.findOne(id);
    if (String(pedido.forma_pagamento).toLowerCase() !== 'pix') {
      throw new BadRequestException('Cobrança Pix disponível apenas para pedidos Pix.');
    }

    if (pedido.id_pagamento) {
      const pagamentoExistente = await this.pagamentosService.findOne(
        pedido.id_pagamento,
      );
      const pixData = this.extractPixData(pagamentoExistente.token_gateway);
      if (pixData) {
        return {
          pedidoId: pedido.id_pedido,
          ...pixData,
          status: pagamentoExistente.status || pixData.status || 'pendente',
        };
      }
    }

    const pixCharge = this.buildPixCharge({
      pedidoId: pedido.id_pedido,
      amount: Number(pedido.total),
    });

    const pagamento = await this.pagamentosService.create({
      id_usuario: pedido.id_usuario,
      tipo: 'pix',
      token_gateway: JSON.stringify(pixCharge),
      status: 'pendente',
    });

    await this.pedidosService.update(pedido.id_pedido, {
      id_pagamento: pagamento.id_pagamento,
    });

    return {
      pedidoId: pedido.id_pedido,
      ...pixCharge,
      status: pagamento.status || 'pendente',
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

    let event: {
      id: string;
      type: string;
      data: { object: Record<string, unknown> };
    };
    try {
      event = this.stripeService.verifyWebhookSignature(req.rawBody, signature);
    } catch {
      throw new BadRequestException('Assinatura Stripe inválida.');
    }

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
        return { received: true };
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

  private buildPixCharge(payload: { pedidoId: number; amount: number }) {
    const amountValue = Number(payload.amount || 0).toFixed(2);
    const txid = `PED${payload.pedidoId}-${Date.now()}`.slice(0, 25);
    const pixCopiaCola = [
      '000201',
      '26330014BR.GOV.BCB.PIX0111sportx@pix',
      '52040000',
      '5303986',
      `540${amountValue.length}${amountValue}`,
      '5802BR',
      '5912SPORTX STORE',
      '6009SAO PAULO',
      `62110507${txid}`,
      '6304ABCD',
    ].join('');
    const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
      pixCopiaCola,
    )}&size=280`;

    return {
      provider: 'pix-manual',
      txid,
      pixCopiaCola,
      qrCodeUrl,
      status: 'pendente',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  private extractPixData(tokenGateway?: string | null):
    | {
        provider: string;
        txid: string;
        pixCopiaCola: string;
        qrCodeUrl: string;
        status: string;
        expiresAt: string;
      }
    | null {
    if (!tokenGateway) return null;
    try {
      const parsed = JSON.parse(tokenGateway) as Record<string, unknown>;
      if (
        typeof parsed.pixCopiaCola === 'string' &&
        typeof parsed.qrCodeUrl === 'string'
      ) {
        return {
          provider: String(parsed.provider || 'pix-manual'),
          txid: String(parsed.txid || ''),
          pixCopiaCola: parsed.pixCopiaCola,
          qrCodeUrl: parsed.qrCodeUrl,
          status: String(parsed.status || 'pendente'),
          expiresAt: String(parsed.expiresAt || ''),
        };
      }
    } catch {
      return null;
    }
    return null;
  }
}

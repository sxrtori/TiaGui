import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { GiftCard, GiftCardStatus } from './entities/gift-card.entity';
import { StripeService } from '../payments/stripe/stripe.service';
import { EmailService } from '../communications/email.service';
import { InMemoryDataService } from '../storage/in-memory-data.service';

@Injectable()
export class GiftCardsService {
  private readonly logger = new Logger(GiftCardsService.name);

  constructor(
    private readonly data: InMemoryDataService,
    private readonly stripeService: StripeService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async list() {
    return [...this.data.giftCards].sort((a, b) => b.id - a.id);
  }

  async findOne(id: number) {
    const giftCard = this.data.giftCards.find((item) => item.id === id);
    if (!giftCard) throw new NotFoundException('Gift card não encontrado.');
    return giftCard;
  }

  async iniciarCheckout(dto: CreateGiftCardDto) {
    const giftCard: GiftCard = {
      id: this.data.nextId('giftCard'),
      codigo: null,
      valor: Math.round(Number(dto.valor)),
      nomeDestinatario: dto.nomeDestinatario.trim(),
      emailDestinatario: dto.emailDestinatario.trim().toLowerCase(),
      mensagem: (dto.mensagem || '').trim(),
      status: GiftCardStatus.PENDENTE,
      metadata: { origem: 'web', storage: 'memory' },
      webhookEventIds: [],
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.data.giftCards.unshift(giftCard);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5500';
    const successUrl = dto.successUrl || `${frontendUrl}/index.html?gift=success&giftCardId=${giftCard.id}`;
    const cancelUrl = dto.cancelUrl || `${frontendUrl}/index.html?gift=cancel&giftCardId=${giftCard.id}`;

    if (!this.stripeService.isConfigured()) {
      giftCard.status = GiftCardStatus.PAGO;
      giftCard.codigo = this.gerarCodigoUnico();
      giftCard.dataPagamento = new Date();
      giftCard.dataEnvio = new Date();
      giftCard.status = GiftCardStatus.ENVIADO;
      giftCard.dataAtualizacao = new Date();

      return {
        giftCard,
        checkout: {
          sessionId: `mock-gift-${giftCard.id}`,
          url: successUrl,
          provider: 'mock',
        },
        message: 'Stripe não configurado: checkout simulado para ambiente sem banco.',
      };
    }

    try {
      const session = await this.stripeService.createGiftCardCheckoutSession({
        giftCardId: giftCard.id,
        valor: Number(giftCard.valor),
        nomeDestinatario: giftCard.nomeDestinatario,
        emailDestinatario: giftCard.emailDestinatario,
        successUrl,
        cancelUrl,
      });

      giftCard.stripeSessionId = session.id;
      giftCard.dataAtualizacao = new Date();

      return {
        giftCard,
        checkout: {
          sessionId: session.id,
          url: session.url,
          cancelUrl,
          provider: 'stripe',
        },
      };
    } catch (error) {
      giftCard.status = GiftCardStatus.CANCELADO;
      giftCard.dataAtualizacao = new Date();
      this.logger.error(`Falha ao iniciar checkout do gift card ${giftCard.id}`, error as Error);
      throw new ServiceUnavailableException(
        'Não foi possível iniciar o pagamento do gift card no momento.',
      );
    }
  }

  async processarPagamentoConfirmado(
    checkoutSession: Record<string, unknown>,
    stripeEventId?: string,
  ): Promise<void> {
    const giftCardId = Number(
      (checkoutSession.metadata as Record<string, string> | undefined)?.giftCardId ||
        checkoutSession.client_reference_id,
    );
    if (!giftCardId) {
      this.logger.warn('Webhook recebido sem giftCardId.');
      return;
    }

    const giftCard = this.data.giftCards.find((item) => item.id === giftCardId);
    if (!giftCard) {
      this.logger.warn(`Gift card ${giftCardId} não encontrado para webhook.`);
      return;
    }

    const processedEvents = giftCard.webhookEventIds || [];
    if (stripeEventId && processedEvents.includes(stripeEventId)) {
      this.logger.warn(`Evento Stripe duplicado ignorado: ${stripeEventId}`);
      return;
    }

    if (giftCard.status === GiftCardStatus.ENVIADO) {
      if (stripeEventId) giftCard.webhookEventIds = [...processedEvents, stripeEventId];
      giftCard.dataAtualizacao = new Date();
      return;
    }

    giftCard.status = GiftCardStatus.PAGO;
    giftCard.dataPagamento = new Date();
    giftCard.stripeSessionId = String(checkoutSession.id || giftCard.stripeSessionId || '');
    giftCard.stripePaymentIntentId = String(checkoutSession.payment_intent || giftCard.stripePaymentIntentId || '');
    giftCard.codigo = giftCard.codigo || this.gerarCodigoUnico();
    if (stripeEventId) giftCard.webhookEventIds = [...processedEvents, stripeEventId];

    await this.emailService.enviarGiftCardEmail({
      nomeDestinatario: giftCard.nomeDestinatario,
      emailDestinatario: giftCard.emailDestinatario,
      valor: Number(giftCard.valor),
      codigo: giftCard.codigo,
      mensagem: giftCard.mensagem,
    });

    giftCard.status = GiftCardStatus.ENVIADO;
    giftCard.dataEnvio = new Date();
    giftCard.dataAtualizacao = new Date();
  }

  private gerarCodigoUnico() {
    return `SPX-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
}

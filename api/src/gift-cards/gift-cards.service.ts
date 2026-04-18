import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { GiftCard, GiftCardStatus } from './entities/gift-card.entity';
import { StripeService } from '../payments/stripe/stripe.service';
import { Repository } from 'typeorm';
import { EmailService } from '../communications/email.service';

@Injectable()
export class GiftCardsService {
  private readonly logger = new Logger(GiftCardsService.name);

  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,
    private readonly stripeService: StripeService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async list() {
    return this.giftCardRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const giftCard = await this.giftCardRepository.findOne({ where: { id } });
    if (!giftCard) throw new NotFoundException('Gift card não encontrado.');
    return giftCard;
  }

  async iniciarCheckout(dto: CreateGiftCardDto) {
    const giftCard = {
      codigo: null,
      valor: Math.round(Number(dto.valor)),
      nomeDestinatario: dto.nomeDestinatario.trim(),
      emailDestinatario: dto.emailDestinatario.trim().toLowerCase(),
      mensagem: (dto.mensagem || '').trim(),
      status: GiftCardStatus.PENDENTE,
      metadata: { origem: 'web', storage: 'postgres' },
      webhookEventIds: [],
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    const savedGiftCard = await this.giftCardRepository.save(
      this.giftCardRepository.create(giftCard),
    );

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5500';
    const successUrl =
      dto.successUrl ||
      `${frontendUrl}/index.html?gift=success&giftCardId=${savedGiftCard.id}`;
    const cancelUrl =
      dto.cancelUrl ||
      `${frontendUrl}/index.html?gift=cancel&giftCardId=${savedGiftCard.id}`;

    if (!this.stripeService.isConfigured()) {
      savedGiftCard.status = GiftCardStatus.PAGO;
      savedGiftCard.codigo = this.gerarCodigoUnico();
      savedGiftCard.dataPagamento = new Date();
      savedGiftCard.dataEnvio = new Date();
      savedGiftCard.status = GiftCardStatus.ENVIADO;
      savedGiftCard.dataAtualizacao = new Date();
      await this.giftCardRepository.save(savedGiftCard);

      return {
        giftCard: savedGiftCard,
        checkout: {
          sessionId: `mock-gift-${savedGiftCard.id}`,
          url: successUrl,
          provider: 'mock',
        },
        message:
          'Stripe não configurado: checkout simulado para ambiente sem banco.',
      };
    }

    try {
      const session = await this.stripeService.createGiftCardCheckoutSession({
        giftCardId: savedGiftCard.id,
        valor: Number(giftCard.valor),
        nomeDestinatario: giftCard.nomeDestinatario,
        emailDestinatario: giftCard.emailDestinatario,
        successUrl,
        cancelUrl,
      });

      savedGiftCard.stripeSessionId = session.id;
      savedGiftCard.dataAtualizacao = new Date();
      await this.giftCardRepository.save(savedGiftCard);

      return {
        giftCard: savedGiftCard,
        checkout: {
          sessionId: session.id,
          url: session.url,
          cancelUrl,
          provider: 'stripe',
        },
      };
    } catch (error) {
      savedGiftCard.status = GiftCardStatus.CANCELADO;
      savedGiftCard.dataAtualizacao = new Date();
      await this.giftCardRepository.save(savedGiftCard);
      this.logger.error(
        `Falha ao iniciar checkout do gift card ${savedGiftCard.id}`,
        error as Error,
      );
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
      (checkoutSession.metadata as Record<string, string> | undefined)
        ?.giftCardId || checkoutSession.client_reference_id,
    );
    if (!giftCardId) {
      this.logger.warn('Webhook recebido sem giftCardId.');
      return;
    }

    const giftCard = await this.giftCardRepository.findOne({
      where: { id: giftCardId },
    });
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
      if (stripeEventId)
        giftCard.webhookEventIds = [...processedEvents, stripeEventId];
      giftCard.dataAtualizacao = new Date();
      return;
    }

    giftCard.status = GiftCardStatus.PAGO;
    giftCard.dataPagamento = new Date();
    if (typeof checkoutSession.id === 'string') {
      giftCard.stripeSessionId = checkoutSession.id;
    }
    if (typeof checkoutSession.payment_intent === 'string') {
      giftCard.stripePaymentIntentId = checkoutSession.payment_intent;
    }
    giftCard.codigo = giftCard.codigo || this.gerarCodigoUnico();
    if (stripeEventId)
      giftCard.webhookEventIds = [...processedEvents, stripeEventId];

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
    await this.giftCardRepository.save(giftCard);
  }

  private gerarCodigoUnico() {
    return `SPX-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
}

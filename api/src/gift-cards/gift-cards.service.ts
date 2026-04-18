import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { GiftCard, GiftCardStatus } from './entities/gift-card.entity';
import { StripeService } from '../payments/stripe/stripe.service';
import { EmailService } from '../communications/email.service';

@Injectable()
export class GiftCardsService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,
    private readonly stripeService: StripeService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async list() {
    return this.giftCardRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const giftCard = await this.giftCardRepository.findOne({ where: { id } });
    if (!giftCard) throw new NotFoundException('Gift card não encontrado.');
    return giftCard;
  }

  async iniciarCheckout(dto: CreateGiftCardDto) {
    const giftCard = this.giftCardRepository.create({
      codigo: null,
      valor: Math.round(Number(dto.valor)),
      nomeDestinatario: dto.nomeDestinatario.trim(),
      emailDestinatario: dto.emailDestinatario.trim().toLowerCase(),
      mensagem: (dto.mensagem || '').trim(),
      status: GiftCardStatus.PENDENTE,
      metadata: {
        origem: 'web',
      },
    });

    const persisted = await this.giftCardRepository.save(giftCard);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5500';
    const successUrl =
      dto.successUrl || `${frontendUrl}/index.html?gift=success&giftCardId=${persisted.id}`;
    const cancelUrl =
      dto.cancelUrl || `${frontendUrl}/index.html?gift=cancel&giftCardId=${persisted.id}`;

    try {
      const session = await this.stripeService.createGiftCardCheckoutSession({
        giftCardId: persisted.id,
        valor: Number(persisted.valor),
        nomeDestinatario: persisted.nomeDestinatario,
        emailDestinatario: persisted.emailDestinatario,
        successUrl,
        cancelUrl,
      });

      persisted.stripeSessionId = session.id;
      await this.giftCardRepository.save(persisted);

      return {
        giftCard: persisted,
        checkout: {
          sessionId: session.id,
          url: session.url,
        },
      };
    } catch {
      await this.giftCardRepository.update(
        { id: persisted.id },
        { status: GiftCardStatus.CANCELADO },
      );
      throw new ServiceUnavailableException(
        'Não foi possível iniciar o pagamento do gift card no momento.',
      );
    }
  }

  async processarPagamentoConfirmado(
    checkoutSession: Record<string, unknown>,
  ): Promise<void> {
    const giftCardId = Number(
      (checkoutSession.metadata as Record<string, string> | undefined)?.giftCardId ||
        checkoutSession.client_reference_id,
    );
    if (!giftCardId) return;

    const giftCard = await this.giftCardRepository.findOne({
      where: { id: giftCardId },
    });
    if (!giftCard || giftCard.status === GiftCardStatus.ENVIADO) return;

    giftCard.status = GiftCardStatus.PAGO;
    giftCard.dataPagamento = new Date();
    giftCard.stripeSessionId = String(checkoutSession.id || giftCard.stripeSessionId || '');
    giftCard.stripePaymentIntentId = String(
      checkoutSession.payment_intent || giftCard.stripePaymentIntentId || '',
    );
    giftCard.codigo = giftCard.codigo || this.gerarCodigoUnico();
    await this.giftCardRepository.save(giftCard);

    await this.emailService.enviarGiftCardEmail({
      nomeDestinatario: giftCard.nomeDestinatario,
      emailDestinatario: giftCard.emailDestinatario,
      valor: Number(giftCard.valor),
      codigo: giftCard.codigo,
      mensagem: giftCard.mensagem,
    });

    giftCard.status = GiftCardStatus.ENVIADO;
    giftCard.dataEnvio = new Date();
    await this.giftCardRepository.save(giftCard);
  }

  private gerarCodigoUnico() {
    return `SPX-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
}

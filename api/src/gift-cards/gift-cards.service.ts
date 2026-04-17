import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';

export type GiftCardStatus = 'pendente' | 'pago' | 'enviado' | 'usado';

type GiftCardRecord = {
  id: number;
  codigo: string | null;
  valor: number;
  destinatarioNome: string;
  destinatarioEmail: string;
  mensagem: string;
  status: GiftCardStatus;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class GiftCardsService {
  private giftCards: GiftCardRecord[] = [];

  list() {
    return this.giftCards;
  }

  findOne(id: number) {
    const giftCard = this.giftCards.find((item) => item.id === id);
    if (!giftCard) throw new NotFoundException('Gift card não encontrado.');
    return giftCard;
  }

  iniciarCheckout(dto: CreateGiftCardDto) {
    const now = new Date().toISOString();
    const giftCard: GiftCardRecord = {
      id: Date.now(),
      codigo: null,
      valor: Math.round(Number(dto.valor)),
      destinatarioNome: dto.destinatarioNome.trim(),
      destinatarioEmail: dto.destinatarioEmail.trim().toLowerCase(),
      mensagem: (dto.mensagem || '').trim(),
      status: 'pendente',
      createdAt: now,
      updatedAt: now,
    };

    this.giftCards.unshift(giftCard);

    return {
      giftCard,
      pagamento: {
        status: 'pendente',
        proximaEtapa: 'confirmar_pagamento',
      },
      gateway: {
        provider: 'simulado',
        preparadoPara: ['melhor_envio_payments', 'stripe', 'mercado_pago'],
      },
    };
  }

  confirmarPagamento(id: number) {
    const giftCard = this.findOne(id);
    if (giftCard.status === 'enviado' || giftCard.status === 'usado') {
      return giftCard;
    }

    const codigo = giftCard.codigo || this.gerarCodigoUnico();
    giftCard.codigo = codigo;
    giftCard.status = 'pago';
    giftCard.updatedAt = new Date().toISOString();

    this.enviarGiftCardEmail(giftCard);

    giftCard.status = 'enviado';
    giftCard.updatedAt = new Date().toISOString();

    return {
      giftCard,
      email: {
        status: 'enviado',
        provider: 'simulado',
      },
    };
  }

  private gerarCodigoUnico() {
    let code = `SPX-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    while (this.giftCards.some((item) => item.codigo === code)) {
      code = `SPX-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    }
    return code;
  }

  // Estrutura preparada para providers reais (Resend/Nodemailer).
  private enviarGiftCardEmail(giftCard: GiftCardRecord) {
    return {
      provider: 'simulado',
      to: giftCard.destinatarioEmail,
      subject: `Seu gift card SportX (${giftCard.codigo})`,
      template: 'gift-card',
      preparedIntegrations: ['resend', 'nodemailer'],
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildGiftCardEmailTemplate } from './templates/gift-card-email.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async enviarGiftCardEmail(payload: {
    nomeDestinatario: string;
    emailDestinatario: string;
    valor: number;
    codigo: string;
    mensagem?: string;
  }) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const from = this.configService.get<string>('RESEND_FROM_EMAIL') || 'SportX <onboarding@resend.dev>';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY não configurada. E-mail não enviado.');
      return { status: 'skipped', provider: 'resend', reason: 'missing_api_key' };
    }

    const html = buildGiftCardEmailTemplate(payload);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [payload.emailDestinatario],
        subject: `Seu gift card SportX (${payload.codigo})`,
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`Falha ao enviar e-mail do gift card: ${details}`);
      throw new Error('Não foi possível enviar o e-mail do gift card.');
    }

    this.logger.log(`Gift card enviado com sucesso para ${payload.emailDestinatario}.`);
    return { status: 'sent', provider: 'resend' };
  }
}

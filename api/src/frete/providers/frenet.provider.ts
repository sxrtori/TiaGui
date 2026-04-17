import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CalcularFreteDto } from '../dto/calcular-frete.dto';
import { CotacaoFreteResultado, FreteProvider } from './frete-provider.interface';

type FrenetQuoteResponse = {
  ShippingSevicesArray?: Array<{
    ServiceCode?: string;
    ServiceDescription?: string;
    Carrier?: string;
    CarrierCode?: string;
    DeliveryTime?: number;
    ShippingPrice?: number;
    Error?: boolean;
    ErrorMessage?: string;
  }>;
};

@Injectable()
export class FrenetProvider implements FreteProvider {
  private readonly quoteUrl: string;
  private readonly token: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.quoteUrl = this.configService.get<string>('FRENET_QUOTE_URL') || 'https://api.frenet.com.br/shipping/quote';
    this.token = this.configService.get<string>('FRENET_TOKEN') || '';
    this.timeoutMs = Number(this.configService.get<string>('FRENET_TIMEOUT_MS') || 12000);
  }

  async calcular(payload: CalcularFreteDto & { cepOrigem: string }): Promise<CotacaoFreteResultado> {
    if (!this.token) {
      throw new ServiceUnavailableException('Integração de frete indisponível: FRENET_TOKEN não configurado');
    }

    const body = {
      SellerCEP: payload.cepOrigem.replace(/\D/g, ''),
      RecipientCEP: payload.cep.replace(/\D/g, ''),
      ShipmentInvoiceValue: Number(payload.subtotal.toFixed(2)),
      ShippingItemArray: payload.itens.map((item) => ({
        Height: Number(item.alturaCm.toFixed(2)),
        Length: Number(item.comprimentoCm.toFixed(2)),
        Width: Number(item.larguraCm.toFixed(2)),
        Weight: Number(item.pesoKg.toFixed(3)),
        Quantity: Math.max(1, Math.round(Number(item.quantidade))),
        SKU: item.sku || undefined,
      })),
      RecipientCountry: 'BRA',
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.quoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: this.token,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ServiceUnavailableException('Falha ao consultar cotação de frete no provedor');
      }

      const data = (await response.json()) as FrenetQuoteResponse;
      const validOptions = (data.ShippingSevicesArray || [])
        .filter((service) => !service.Error && Number(service.ShippingPrice) >= 0)
        .map((service) => ({
          id: String(service.ServiceCode || service.CarrierCode || service.ServiceDescription || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
          nome: String(service.ServiceDescription || 'Serviço de entrega'),
          transportadora: String(service.Carrier || 'Transportadora'),
          codigoServico: service.ServiceCode,
          prazoMin: Math.max(1, Number(service.DeliveryTime || 1)),
          prazoMax: Math.max(1, Number(service.DeliveryTime || 1)),
          valor: Number(Number(service.ShippingPrice || 0).toFixed(2)),
          moeda: 'BRL' as const,
          observacao: service.ErrorMessage,
        }));

      return {
        origemCep: payload.cepOrigem,
        destinoCep: payload.cep,
        opcoes: validOptions,
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) throw error;
      throw new ServiceUnavailableException('Serviço de frete indisponível no momento');
    } finally {
      clearTimeout(timer);
    }
  }
}

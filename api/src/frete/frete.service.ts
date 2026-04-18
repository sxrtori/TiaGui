import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CalcularFreteDto } from './dto/calcular-frete.dto';
import { CepService } from './services/cep.service';
import type {
  CotacaoFreteResultado,
  FreteProvider,
} from './providers/frete-provider.interface';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class FreteService {
  private readonly origemCep: string;

  constructor(
    private readonly cepService: CepService,
    @Inject('FreteProvider') private readonly provider: FreteProvider,
    private readonly configService: ConfigService,
  ) {
    this.origemCep = this.cepService.normalize(
      this.configService.get<string>('SHIPPING_ORIGIN_CEP') || '01001-000',
    );
  }

  async consultarCep(cep: string) {
    return this.cepService.buscarEndereco(cep);
  }

  async calcularFrete(payload: CalcularFreteDto) {
    if (!Array.isArray(payload.itens) || !payload.itens.length) {
      throw new BadRequestException(
        'Nenhum item válido informado para cotação de frete.',
      );
    }

    const destinoCep = this.cepService.normalize(payload.cep);
    const enderecoDestino = await this.cepService.buscarEndereco(destinoCep);
    const subtotal = Number(payload.subtotal || 0);

    const itensNormalizados = payload.itens.map((item) => ({
      ...item,
      valorUnitario: Number(item.valorUnitario ?? item.preco ?? 0),
    }));

    if (itensNormalizados.some((item) => !Number.isFinite(item.valorUnitario) || item.valorUnitario < 0)) {
      throw new BadRequestException('Item de frete com valor inválido.');
    }

    let cotacao: CotacaoFreteResultado;
    let providerName = 'frenet';
    try {
      cotacao = await this.provider.calcular({
        ...payload,
        itens: itensNormalizados,
        cep: destinoCep,
        cepOrigem: this.origemCep,
      });
    } catch {
      cotacao = this.calcularFreteSimulado(destinoCep);
      providerName = 'simulado';
    }

    if (!cotacao.opcoes.length) {
      throw new ServiceUnavailableException(
        'Nenhuma opção de frete disponível para este CEP.',
      );
    }

    const maisRapida = [...cotacao.opcoes].sort(
      (a, b) => a.prazoMin - b.prazoMin,
    )[0];
    const maisBarata = [...cotacao.opcoes].sort((a, b) => a.valor - b.valor)[0];

    const opcoes = cotacao.opcoes.map((option) => {
      const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
      return {
        ...option,
        valorOriginal: option.valor,
        valor: isFree ? 0 : option.valor,
        freteAbsorvidoPelaLoja: isFree,
        destaque:
          option.id === maisRapida.id
            ? 'mais-rapida'
            : option.id === maisBarata.id
              ? 'melhor-preco'
              : undefined,
      };
    });

    return {
      origem: {
        cep: this.origemCep,
      },
      destinoCep,
      destinoEndereco: enderecoDestino,
      freteGratisAtivo: subtotal >= FREE_SHIPPING_THRESHOLD,
      limiteFreteGratis: FREE_SHIPPING_THRESHOLD,
      opcoes,
      provider: providerName,
      calculadoEm: new Date().toISOString(),
    };
  }

  private calcularFreteSimulado(destinoCep: string): CotacaoFreteResultado {
    return {
      origemCep: this.origemCep,
      destinoCep,
      opcoes: [
        {
          id: 'economico',
          nome: 'Econômico',
          transportadora: 'SportX Entregas',
          codigoServico: 'ECO',
          prazoMin: 7,
          prazoMax: 10,
          valor: 12.9,
          moeda: 'BRL' as const,
        },
        {
          id: 'padrao',
          nome: 'Padrão',
          transportadora: 'SportX Entregas',
          codigoServico: 'PAD',
          prazoMin: 3,
          prazoMax: 5,
          valor: 18.9,
          moeda: 'BRL' as const,
        },
        {
          id: 'expresso',
          nome: 'Expresso',
          transportadora: 'SportX Entregas',
          codigoServico: 'EXP',
          prazoMin: 1,
          prazoMax: 2,
          valor: 29.9,
          moeda: 'BRL' as const,
        },
      ],
    };
  }
}

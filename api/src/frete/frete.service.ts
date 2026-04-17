import { BadRequestException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CalcularFreteDto } from './dto/calcular-frete.dto';
import { CepService } from './services/cep.service';
import type { FreteProvider } from './providers/frete-provider.interface';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class FreteService {
  private readonly origemCep: string;

  constructor(
    private readonly cepService: CepService,
    @Inject('FreteProvider') private readonly provider: any,
    private readonly configService: ConfigService,
  ) {
    this.origemCep = this.cepService.normalize(this.configService.get<string>('SHIPPING_ORIGIN_CEP') || '01001-000');
  }

  async consultarCep(cep: string) {
    return this.cepService.buscarEndereco(cep);
  }

  async calcularFrete(payload: CalcularFreteDto) {
    if (!Array.isArray(payload.itens) || !payload.itens.length) {
      throw new BadRequestException('Nenhum item válido informado para cotação de frete.');
    }

    const destinoCep = this.cepService.normalize(payload.cep);
    const enderecoDestino = await this.cepService.buscarEndereco(destinoCep);
    const subtotal = Number(payload.subtotal || 0);

    const cotacao = await this.provider.calcular({
      ...payload,
      cep: destinoCep,
      cepOrigem: this.origemCep,
    });

    if (!cotacao.opcoes.length) {
      throw new ServiceUnavailableException('Nenhuma opção de frete disponível para este CEP.');
    }

    const maisRapida = [...cotacao.opcoes].sort((a, b) => a.prazoMin - b.prazoMin)[0];
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
      provider: 'frenet',
      calculadoEm: new Date().toISOString(),
    };
  }
}

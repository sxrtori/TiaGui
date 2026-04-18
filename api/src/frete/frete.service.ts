import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalcularFreteDto } from './dto/calcular-frete.dto';
import { EntregaOpcao } from './entities/entrega-opcao.entity';
import { CepService } from './services/cep.service';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class FreteService {
  private readonly origemCep: string;

  constructor(
    private readonly cepService: CepService,
    private readonly configService: ConfigService,
    @InjectRepository(EntregaOpcao)
    private readonly entregaOpcaoRepository: Repository<EntregaOpcao>,
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
    const subtotal = this.roundMoney(payload.subtotal || 0);

    const pesoTotal = payload.itens.reduce((sum, item) => {
      const peso = Number(item.pesoKg || 0);
      const quantidade = Math.max(1, Number(item.quantidade || 1));
      if (!Number.isFinite(peso) || peso <= 0) {
        throw new BadRequestException(
          'Item com peso inválido. Verifique as variações do produto.',
        );
      }
      return sum + peso * quantidade;
    }, 0);

    const opcoesAtivas = await this.entregaOpcaoRepository.find({
      where: { ativa: true },
      order: { ordem: 'ASC', id_entrega_opcao: 'ASC' },
    });

    if (!opcoesAtivas.length) {
      throw new BadRequestException(
        'Nenhuma opção de entrega ativa foi encontrada no banco.',
      );
    }

    const freteGratisAtivo = subtotal >= FREE_SHIPPING_THRESHOLD;
    const distanceMultiplier = this.distanceMultiplier(this.origemCep, destinoCep);

    const opcoes = opcoesAtivas.map((option) => {
      const valorBase = Number(option.valor_base || 0);
      const valorPorKg = Number(option.valor_por_kg || 0);
      const bruto = this.roundMoney(
        (valorBase + valorPorKg * pesoTotal) * distanceMultiplier,
      );
      const valor = freteGratisAtivo ? 0 : bruto;
      return {
        id: String(option.id_entrega_opcao),
        id_entrega_opcao: option.id_entrega_opcao,
        nome: option.nome,
        descricao: option.descricao,
        prazoMin: option.prazo_min_dias,
        prazoMax: option.prazo_max_dias,
        valorOriginal: bruto,
        valor,
        freteAbsorvidoPelaLoja: freteGratisAtivo,
        moeda: 'BRL' as const,
      };
    });

    return {
      origem: { cep: this.origemCep },
      destinoCep,
      destinoEndereco: enderecoDestino,
      subtotal,
      pesoTotalKg: Number(pesoTotal.toFixed(3)),
      freteGratisAtivo,
      limiteFreteGratis: FREE_SHIPPING_THRESHOLD,
      opcoes,
      provider: 'database',
      calculadoEm: new Date().toISOString(),
    };
  }

  private distanceMultiplier(origemCep: string, destinoCep: string): number {
    const origemPrefix = Number(origemCep.replace(/\D/g, '').slice(0, 2));
    const destinoPrefix = Number(destinoCep.replace(/\D/g, '').slice(0, 2));
    const delta = Math.abs(origemPrefix - destinoPrefix);

    if (delta <= 5) return 1;
    if (delta <= 15) return 1.12;
    if (delta <= 30) return 1.2;
    return 1.35;
  }

  private roundMoney(value: number): number {
    return Number(Number(value || 0).toFixed(2));
  }
}

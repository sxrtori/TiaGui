import { Injectable } from '@nestjs/common';
import { CalcularFreteDto } from './dto/calcular-frete.dto';

type FreteOpcao = {
  id: string;
  nome: string;
  tipo: 'expresso' | 'economico' | 'retirada';
  prazoMin: number;
  prazoMax: number;
  valor: number;
  destaque?: 'mais-rapida' | 'melhor-custo-beneficio';
};

const ORIGEM_CEP = '01000-000';
const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class FreteService {
  async calcularFrete(payload: CalcularFreteDto) {
    const subtotal = Number(payload.subtotal || 0);
    const cepNumerico = Number(String(payload.cep).replace(/\D/g, ''));
    const distanciaFactor = Number.isNaN(cepNumerico)
      ? 1
      : Math.min(Math.max((cepNumerico % 1000) / 1000, 0.1), 0.95);

    const base: Array<{
      id: string;
      nome: string;
      tipo: FreteOpcao['tipo'];
      prazoMin: number;
      prazoMax: number;
      valorBase: number;
      peso: number;
    }> = [
      { id: 'sedex', nome: 'Sedex', tipo: 'expresso', prazoMin: 1, prazoMax: 3, valorBase: 49.9, peso: 12 },
      { id: 'pac', nome: 'PAC', tipo: 'economico', prazoMin: 4, prazoMax: 8, valorBase: 22.9, peso: 8 },
      { id: 'correios', nome: 'Correios', tipo: 'economico', prazoMin: 3, prazoMax: 6, valorBase: 29.9, peso: 10 },
      { id: 'expressa', nome: 'Expressa', tipo: 'expresso', prazoMin: 1, prazoMax: 2, valorBase: 59.9, peso: 15 },
      { id: 'economica', nome: 'Econômica', tipo: 'economico', prazoMin: 5, prazoMax: 10, valorBase: 18.9, peso: 6 },
      { id: 'retirada', nome: 'Retirada em loja (SP)', tipo: 'retirada', prazoMin: 0, prazoMax: 1, valorBase: 0, peso: 0 },
    ];

    let opcoes: FreteOpcao[] = base.map((item) => {
      const valor = item.id === 'retirada'
        ? 0
        : Number((item.valorBase + distanciaFactor * item.peso).toFixed(2));
      return {
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        prazoMin: item.prazoMin,
        prazoMax: item.prazoMax,
        valor,
      };
    });

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      opcoes = opcoes.map((item) => ({ ...item, valor: 0 }));
    }

    const maisRapida = opcoes.reduce((acc, item) =>
      item.prazoMin < acc.prazoMin ? item : acc,
    );

    const melhorCustoBeneficio = opcoes.reduce((acc, item) => {
      const scoreAtual = acc.valor + acc.prazoMax * 1.8;
      const scoreItem = item.valor + item.prazoMax * 1.8;
      return scoreItem < scoreAtual ? item : acc;
    });

    opcoes = opcoes.map((item) => ({
      ...item,
      destaque:
        item.id === maisRapida.id
          ? 'mais-rapida'
          : item.id === melhorCustoBeneficio.id
            ? 'melhor-custo-beneficio'
            : undefined,
    }));

    const enderecoDestino = await this.buscarEnderecoPorCep(payload.cep);

    return {
      origem: { cidade: 'São Paulo', estado: 'SP', cep: ORIGEM_CEP },
      destinoCep: payload.cep,
      destinoEndereco: enderecoDestino,
      freteGratisAtivo: subtotal >= FREE_SHIPPING_THRESHOLD,
      limiteFreteGratis: FREE_SHIPPING_THRESHOLD,
      opcoes,
    };
  }

  private async buscarEnderecoPorCep(cep: string) {
    const digits = String(cep || '').replace(/\D/g, '');
    if (digits.length !== 8) {
      return {
        cep,
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
      };
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) throw new Error('CEP indisponível');
      const data = await response.json();
      if (data?.erro) throw new Error('CEP não encontrado');
      return {
        cep: `${digits.slice(0, 5)}-${digits.slice(5)}`,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: String(data.uf || '').toUpperCase(),
      };
    } catch (_error) {
      return {
        cep: `${digits.slice(0, 5)}-${digits.slice(5)}`,
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
      };
    }
  }
}

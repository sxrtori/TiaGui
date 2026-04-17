import { Injectable } from '@nestjs/common';
import { CalcularFreteDto } from './dto/calcular-frete.dto';

type FreteOpcao = {
  id: string;
  nome: string;
  prazoMin: number;
  prazoMax: number;
  valor: number;
  destaque?: 'mais-rapida' | 'melhor-custo-beneficio';
};

const ORIGEM_CEP = '01000-000';
const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class FreteService {
  calcularFrete(payload: CalcularFreteDto) {
    const subtotal = Number(payload.subtotal || 0);
    const cepNumerico = Number(String(payload.cep).replace(/\D/g, ''));
    const distanciaFactor = Number.isNaN(cepNumerico)
      ? 1
      : Math.min(Math.max((cepNumerico % 1000) / 1000, 0.1), 0.95);

    const base = [
      { id: 'sedex', nome: 'Sedex', prazoMin: 1, prazoMax: 3, valorBase: 49.9, peso: 12 },
      { id: 'pac', nome: 'PAC', prazoMin: 4, prazoMax: 8, valorBase: 22.9, peso: 8 },
      { id: 'correios', nome: 'Correios', prazoMin: 3, prazoMax: 6, valorBase: 29.9, peso: 10 },
      { id: 'expressa', nome: 'Expressa', prazoMin: 1, prazoMax: 2, valorBase: 59.9, peso: 15 },
      { id: 'economica', nome: 'Econômica', prazoMin: 5, prazoMax: 10, valorBase: 18.9, peso: 6 },
      { id: 'retirada', nome: 'Retirada em loja (SP)', prazoMin: 0, prazoMax: 1, valorBase: 0, peso: 0 },
    ];

    let opcoes: FreteOpcao[] = base.map((item) => {
      const valor = item.id === 'retirada'
        ? 0
        : Number((item.valorBase + distanciaFactor * item.peso).toFixed(2));
      return {
        id: item.id,
        nome: item.nome,
        prazoMin: item.prazoMin,
        prazoMax: item.prazoMax,
        valor,
      };
    });

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      opcoes = opcoes.map((item) =>
        item.id === 'retirada' || item.id === 'economica'
          ? item
          : { ...item, valor: 0 },
      );
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

    return {
      origem: { cidade: 'São Paulo', estado: 'SP', cep: ORIGEM_CEP },
      destinoCep: payload.cep,
      freteGratisAtivo: subtotal >= FREE_SHIPPING_THRESHOLD,
      limiteFreteGratis: FREE_SHIPPING_THRESHOLD,
      opcoes,
    };
  }
}

import { CalcularFreteDto } from '../dto/calcular-frete.dto';

export type CotacaoFreteOpcao = {
  id: string;
  nome: string;
  transportadora: string;
  codigoServico?: string;
  prazoMin: number;
  prazoMax: number;
  valor: number;
  moeda: 'BRL';
  observacao?: string;
};

export type CotacaoFreteResultado = {
  origemCep: string;
  destinoCep: string;
  opcoes: CotacaoFreteOpcao[];
};

export interface FreteProvider {
  calcular(payload: CalcularFreteDto & { cepOrigem: string }): Promise<CotacaoFreteResultado>;
}

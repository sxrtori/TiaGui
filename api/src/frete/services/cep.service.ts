import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

export type CepEndereco = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
};

@Injectable()
export class CepService {
  normalize(rawCep: string): string {
    const digits = String(rawCep || '').replace(/\D/g, '');
    if (digits.length !== 8) {
      throw new BadRequestException('CEP inválido. Informe 8 dígitos.');
    }
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  async buscarEndereco(rawCep: string): Promise<CepEndereco> {
    const cep = this.normalize(rawCep);
    const digits = cep.replace(/\D/g, '');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) {
        throw new BadGatewayException('Não foi possível consultar o CEP no momento.');
      }
      const data = (await response.json()) as {
        erro?: boolean;
        cep?: string;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
        complemento?: string;
      };

      if (data?.erro) {
        throw new BadRequestException('CEP não encontrado.');
      }

      return {
        cep: data.cep || cep,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: String(data.uf || '').toUpperCase(),
        complemento: data.complemento || '',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof BadGatewayException) {
        throw error;
      }
      throw new BadGatewayException('Falha de rede ao consultar o CEP.');
    }
  }
}

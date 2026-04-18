import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

export type CepEndereco = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
  origem?: 'viacep' | 'fallback';
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

      if (data?.erro) throw new BadRequestException('CEP não encontrado.');

      return {
        cep: data.cep || cep,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: String(data.uf || '').toUpperCase(),
        complemento: data.complemento || '',
        origem: 'viacep',
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      // Fallback temporário para manter fluxo sem dependência externa de rede.
      return this.fallbackEndereco(cep);
    }
  }

  private fallbackEndereco(cep: string): CepEndereco {
    const stateByPrefix: Record<string, { estado: string; cidade: string }> = {
      '0': { estado: 'SP', cidade: 'São Paulo' },
      '1': { estado: 'SP', cidade: 'São Paulo' },
      '2': { estado: 'RJ', cidade: 'Rio de Janeiro' },
      '3': { estado: 'MG', cidade: 'Belo Horizonte' },
      '4': { estado: 'BA', cidade: 'Salvador' },
      '5': { estado: 'PE', cidade: 'Recife' },
      '6': { estado: 'CE', cidade: 'Fortaleza' },
      '7': { estado: 'DF', cidade: 'Brasília' },
      '8': { estado: 'PR', cidade: 'Curitiba' },
      '9': { estado: 'RS', cidade: 'Porto Alegre' },
    };

    const guess = stateByPrefix[cep[0]] || { estado: 'SP', cidade: 'São Paulo' };
    return {
      cep,
      rua: 'Endereço não identificado (fallback)',
      bairro: 'Bairro não identificado',
      cidade: guess.cidade,
      estado: guess.estado,
      complemento: '',
      origem: 'fallback',
    };
  }
}

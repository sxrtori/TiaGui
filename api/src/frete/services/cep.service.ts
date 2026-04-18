import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

export type CepEndereco = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
  origem: 'viacep';
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new BadGatewayException(
          'Não foi possível consultar o CEP no momento.',
        );
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
        origem: 'viacep',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }

      throw new BadGatewayException(
        'Erro de rede ao consultar CEP. Tente novamente.',
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

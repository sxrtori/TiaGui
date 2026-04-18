import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class EnderecoEntregaDto {
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  cep: string;

  @IsString()
  @MaxLength(255)
  rua: string;

  @IsString()
  @MaxLength(20)
  numero: string;

  @IsString()
  @MaxLength(120)
  bairro: string;

  @IsString()
  @MaxLength(120)
  cidade: string;

  @IsString()
  @MaxLength(2)
  estado: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  complemento?: string;
}

class PedidoItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_produto: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_produto_variacao?: number;

  @IsString()
  @MaxLength(180)
  nome: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco_unitario: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  tamanho?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  cor?: string;
}

class ResumoCheckoutDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  frete: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cashback?: number;
}

export class CreatePedidoDto {
  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @IsInt()
  id_endereco?: number;

  @IsOptional()
  @IsInt()
  id_pagamento?: number;

  @IsOptional()
  @IsInt()
  id_entrega_opcao?: number;

  @IsString()
  status: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor_frete: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  desconto?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @IsOptional()
  @IsBoolean()
  frete_gratis?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  origem_cep?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prazo_entrega_min_dias?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prazo_entrega_max_dias?: number;

  @IsString()
  forma_pagamento: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigo_rastreio?: string;

  @IsOptional()
  @IsString()
  observacoes_entrega?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoEntregaDto)
  endereco_entrega?: EnderecoEntregaDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  itens?: PedidoItemDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ResumoCheckoutDto)
  resumo_checkout?: ResumoCheckoutDto;
}

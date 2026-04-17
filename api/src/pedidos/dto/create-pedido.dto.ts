import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePedidoDto {
  @IsInt()
  id_usuario: number;

  @IsInt()
  id_endereco: number;

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
}

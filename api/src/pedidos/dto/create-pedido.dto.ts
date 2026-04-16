import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePedidoDto {
  @IsInt()
  id_usuario: number;

  @IsInt()
  id_endereco: number;

  @IsOptional()
  @IsInt()
  id_pagamento?: number;

  @IsString()
  status: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @IsString()
  forma_pagamento: string;
}
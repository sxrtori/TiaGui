import { IsInt, IsNumber, IsOptional, IsPostalCode, IsString, Min } from 'class-validator';

export class CalcularFreteDto {
  @IsPostalCode('BR')
  cep: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantidadeItens?: number;

  @IsOptional()
  @IsString()
  modalidade?: string;
}

import { IsInt, IsNumber, IsOptional, IsPostalCode, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CalcularFreteDto {
  @Transform(({ value }) => String(value || '').replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'))
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

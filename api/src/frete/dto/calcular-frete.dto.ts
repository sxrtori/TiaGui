import { IsInt, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CalcularFreteDto {
  @Transform(({ value }) => String(value || '').replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'))
  @Matches(/^\d{5}-\d{3}$/, { message: 'CEP inválido' })
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

import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProdutoDto {
  @IsInt()
  id_categoria: number;

  @IsString()
  @MaxLength(150)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco_promocional?: number;

  @IsInt()
  @Min(0)
  estoque: number;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsString()
  galeria_imagens?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  genero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeracao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  marca?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(95)
  desconto?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(40)
  cashback?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  modalidade?: string;

  @IsOptional()
  @IsBoolean()
  lancamento?: boolean;

  @IsOptional()
  @IsBoolean()
  promocao_ativa?: boolean;

  @IsOptional()
  @IsInt()
  id_vendedor?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  slug?: string;
}

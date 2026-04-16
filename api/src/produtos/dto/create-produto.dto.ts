import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
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

  @IsInt()
  @Min(0)
  estoque: number;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  genero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeracao?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
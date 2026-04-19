import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateImagemProdutoDto {
  @IsString()
  url_imagem: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_produto_cor?: number;

  @IsOptional()
  @IsString()
  alt_text?: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ordem?: number;
}

class CreateVariacaoProdutoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_produto_cor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_produto_tamanho?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque: number;

  @IsOptional()
  @IsString()
  numeracao?: string;
}

export class CreateProdutoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_categoria?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsString()
  @MaxLength(150)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  genero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  marca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  slug?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImagemProdutoDto)
  imagens?: CreateImagemProdutoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariacaoProdutoDto)
  variacoes?: CreateVariacaoProdutoDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cores?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tamanhos?: string[];

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque?: number;

  @IsOptional()
  @IsString()
  numeracao?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  origem_cep?: string;
}
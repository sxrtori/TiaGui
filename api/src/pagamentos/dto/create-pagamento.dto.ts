import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePagamentoDto {
  @IsInt()
  id_usuario: number;

  @IsString()
  @MaxLength(30)
  tipo: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome_titular?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  ultimos_digitos?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bandeira?: string;

  @IsOptional()
  @IsString()
  token_gateway?: string;
}

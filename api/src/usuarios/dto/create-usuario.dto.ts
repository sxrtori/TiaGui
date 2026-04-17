import {
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsOptional()
  @IsString()
  @IsIn(['cliente', 'admin', 'vendedor'])
  tipo_usuario?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
  cpf?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;
}

import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGiftCardDto {
  @IsString()
  @MaxLength(120)
  destinatarioNome: string;

  @IsEmail()
  destinatarioEmail: string;

  @IsInt()
  @Min(30)
  @Max(2000)
  valor: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mensagem?: string;
}

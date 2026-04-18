import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGiftCardDto {
  @IsString()
  @MaxLength(120)
  nomeDestinatario: string;

  @IsEmail()
  emailDestinatario: string;

  @IsInt()
  @Min(30)
  @Max(2000)
  valor: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mensagem?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  successUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  cancelUrl?: string;
}

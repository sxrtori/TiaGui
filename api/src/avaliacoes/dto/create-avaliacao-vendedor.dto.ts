import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoVendedorDto {
  @IsInt()
  id_usuario: number;

  @IsInt()
  id_vendedor: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @IsString()
  comentario: string;
}

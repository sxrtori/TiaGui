import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoDto {
  @IsInt()
  id_usuario: number;

  @IsInt()
  id_produto: number;

  @IsOptional()
  @IsInt()
  id_pedido?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @IsString()
  comentario: string;
}

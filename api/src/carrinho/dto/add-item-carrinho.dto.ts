import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class AddItemCarrinhoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_produto: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_produto_variacao?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco_unitario: number;
}

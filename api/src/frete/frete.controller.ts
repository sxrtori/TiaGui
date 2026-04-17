import { Body, Controller, Post } from '@nestjs/common';
import { FreteService } from './frete.service';
import { CalcularFreteDto } from './dto/calcular-frete.dto';

@Controller('frete')
export class FreteController {
  constructor(private readonly freteService: FreteService) {}

  @Post('calcular')
  calcular(@Body() payload: CalcularFreteDto) {
    return this.freteService.calcularFrete(payload);
  }
}

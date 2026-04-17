import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FreteService } from './frete.service';
import { CalcularFreteDto } from './dto/calcular-frete.dto';

@Controller('frete')
export class FreteController {
  constructor(private readonly freteService: FreteService) {}

  @Get('cep/:cep')
  consultarCep(@Param('cep') cep: string) {
    return this.freteService.consultarCep(cep);
  }

  @Post('calcular')
  calcular(@Body() payload: CalcularFreteDto) {
    return this.freteService.calcularFrete(payload);
  }
}

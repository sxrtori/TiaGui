import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Get()
  findAll() {
    return this.pagamentosService.findAll();
  }

  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.pagamentosService.findByUsuario(idUsuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.findOne(id);
  }

  @Post()
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentosService.create(createPagamentoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ) {
    return this.pagamentosService.update(id, updatePagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.remove(id);
  }
}

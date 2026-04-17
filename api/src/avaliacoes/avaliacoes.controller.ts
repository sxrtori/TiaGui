import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AvaliacoesService } from './avaliacoes.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  create(@Body() dto: CreateAvaliacaoDto) {
    return this.avaliacoesService.create(dto);
  }

  @Get('produto/:id_produto')
  listByProduct(@Param('id_produto', ParseIntPipe) id_produto: number) {
    return this.avaliacoesService.listByProduct(id_produto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_usuario', ParseIntPipe) id_usuario: number,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.avaliacoesService.update(id, id_usuario, dto);
  }

  @Patch(':id/denunciar')
  report(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacoesService.report(id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_usuario', ParseIntPipe) id_usuario: number,
  ) {
    return this.avaliacoesService.remove(id, id_usuario);
  }
}

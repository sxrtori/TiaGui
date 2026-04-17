import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('id_categoria') id_categoria?: string,
    @Query('promocao') promocao?: string,
    @Query('vendedorId') vendedorId?: string,
  ) {
    return this.produtosService.findAll({
      q,
      id_categoria: id_categoria ? Number(id_categoria) : undefined,
      promocao,
      vendedorId: vendedorId ? Number(vendedorId) : undefined,
    });
  }

  @Get('promocoes/mes')
  findPromotions() {
    return this.produtosService.findAll({ promocao: 'true' });
  }

  @Get('vendedor/:id')
  findBySeller(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.findAll({ vendedorId: id });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.produtosService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.findOne(id);
  }

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Patch(':id/promocao')
  updatePromotion(
    @Param('id', ParseIntPipe) id: number,
    @Body('promocao_ativa', ParseBoolPipe) promocao_ativa: boolean,
    @Body('desconto') desconto?: number,
  ) {
    return this.produtosService.updatePromotion(id, promocao_ativa, desconto);
  }

  @Patch(':id/estoque')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('estoque', ParseIntPipe) estoque: number,
  ) {
    return this.produtosService.updateStock(id, estoque);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.remove(id);
  }
}

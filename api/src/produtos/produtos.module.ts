import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { Categoria } from './entities/categoria.entity';
import { ProdutoCor } from './entities/produto-cor.entity';
import { ProdutoImagem } from './entities/produto-imagem.entity';
import { ProdutoTamanho } from './entities/produto-tamanho.entity';
import { ProdutoVariacao } from './entities/produto-variacao.entity';
import { Produto } from './entities/produto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Produto,
      Categoria,
      ProdutoImagem,
      ProdutoVariacao,
      ProdutoCor,
      ProdutoTamanho,
    ]),
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Usuario])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}

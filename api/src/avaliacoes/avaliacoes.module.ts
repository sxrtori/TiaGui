import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './entities/avaliacao.entity';
import { AvaliacoesService } from './avaliacoes.service';
import { AvaliacoesController } from './avaliacoes.controller';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { AvaliacaoVendedor } from './entities/avaliacao-vendedor.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Produto } from '../produtos/entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliacao, Pedido, AvaliacaoVendedor, Usuario, Produto])],
  providers: [AvaliacoesService],
  controllers: [AvaliacoesController],
})
export class AvaliacoesModule {}

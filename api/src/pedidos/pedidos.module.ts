import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ItemPedido } from './entities/item-pedido.entity';
import { Pedido } from './entities/pedido.entity';
import { EntregaOpcao } from '../frete/entities/entrega-opcao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, ItemPedido, EntregaOpcao])],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ItemPedido } from './entities/item-pedido.entity';
import { Pedido } from './entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, ItemPedido])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { Carrinho } from './entities/carrinho.entity';
import { ItemCarrinho } from './entities/item-carrinho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrinho, ItemCarrinho])],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
})
export class CarrinhoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pagamento])],
  providers: [PagamentosService],
  controllers: [PagamentosController],
  exports: [PagamentosService],
})
export class PagamentosModule {}

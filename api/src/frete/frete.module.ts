import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreteController } from './frete.controller';
import { FreteService } from './frete.service';
import { CepService } from './services/cep.service';
import { EntregaOpcao } from './entities/entrega-opcao.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([EntregaOpcao])],
  controllers: [FreteController],
  providers: [FreteService, CepService],
})
export class FreteModule {}

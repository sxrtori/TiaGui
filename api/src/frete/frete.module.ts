import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FreteController } from './frete.controller';
import { FreteService } from './frete.service';
import { CepService } from './services/cep.service';
import { FrenetProvider } from './providers/frenet.provider';

@Module({
  imports: [ConfigModule],
  controllers: [FreteController],
  providers: [
    FreteService,
    CepService,
    FrenetProvider,
    {
      provide: 'FreteProvider',
      useExisting: FrenetProvider,
    },
  ],
})
export class FreteModule {}

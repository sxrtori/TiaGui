import { Module } from '@nestjs/common';
import { GiftCardsModule } from '../gift-cards/gift-cards.module';
import { PagamentosModule } from '../pagamentos/pagamentos.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [GiftCardsModule, PedidosModule, PagamentosModule],
  controllers: [PaymentsController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}

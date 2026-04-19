import { Module, forwardRef } from '@nestjs/common';
import { GiftCardsModule } from '../gift-cards/gift-cards.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { PagamentosModule } from '../pagamentos/pagamentos.module';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [
    forwardRef(() => GiftCardsModule),
    PedidosModule,
    PagamentosModule,
  ],
  controllers: [PaymentsController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}

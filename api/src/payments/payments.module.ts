import { forwardRef, Module } from '@nestjs/common';
import { GiftCardsModule } from '../gift-cards/gift-cards.module';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [forwardRef(() => GiftCardsModule)],
  controllers: [PaymentsController],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}

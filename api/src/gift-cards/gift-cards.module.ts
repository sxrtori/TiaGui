import { forwardRef, Module } from '@nestjs/common';
import { CommunicationsModule } from '../communications/communications.module';
import { PaymentsModule } from '../payments/payments.module';
import { GiftCardsController } from './gift-cards.controller';
import { GiftCardsService } from './gift-cards.service';

@Module({
  imports: [CommunicationsModule, forwardRef(() => PaymentsModule)],
  controllers: [GiftCardsController],
  providers: [GiftCardsService],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}

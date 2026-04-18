import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationsModule } from '../communications/communications.module';
import { PaymentsModule } from '../payments/payments.module';
import { GiftCard } from './entities/gift-card.entity';
import { GiftCardsController } from './gift-cards.controller';
import { GiftCardsService } from './gift-cards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftCard]),
    CommunicationsModule,
    forwardRef(() => PaymentsModule),
  ],
  controllers: [GiftCardsController],
  providers: [GiftCardsService],
  exports: [GiftCardsService, TypeOrmModule],
})
export class GiftCardsModule {}

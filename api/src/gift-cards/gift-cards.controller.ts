import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GiftCardsService } from './gift-cards.service';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';

@Controller('gift-cards')
export class GiftCardsController {
  constructor(private readonly giftCardsService: GiftCardsService) {}

  @Get()
  list() {
    return this.giftCardsService.list();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.giftCardsService.findOne(id);
  }

  @Post('checkout')
  iniciarCheckout(@Body() dto: CreateGiftCardDto) {
    return this.giftCardsService.iniciarCheckout(dto);
  }
}

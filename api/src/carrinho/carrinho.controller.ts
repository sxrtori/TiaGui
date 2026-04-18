import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { TokenPayload } from '../auth/token.util';
import { AddItemCarrinhoDto } from './dto/add-item-carrinho.dto';
import { CarrinhoService } from './carrinho.service';

@Controller('carrinho')
@UseGuards(AuthGuard)
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  getCarrinho(@CurrentUser() user: TokenPayload) {
    return this.carrinhoService.getCarrinhoByUsuario(user.sub);
  }

  @Post('itens')
  addItem(@CurrentUser() user: TokenPayload, @Body() dto: AddItemCarrinhoDto) {
    return this.carrinhoService.addItem(user.sub, dto);
  }

  @Patch('itens/:idItem/quantidade')
  updateQuantidade(
    @CurrentUser() user: TokenPayload,
    @Param('idItem', ParseIntPipe) idItem: number,
    @Body('quantidade', ParseIntPipe) quantidade: number,
  ) {
    return this.carrinhoService.updateQuantidade(user.sub, idItem, quantidade);
  }

  @Delete('itens/:idItem')
  removeItem(
    @CurrentUser() user: TokenPayload,
    @Param('idItem', ParseIntPipe) idItem: number,
  ) {
    return this.carrinhoService.removeItem(user.sub, idItem);
  }
}

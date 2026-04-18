import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenPayload } from '../auth/token.util';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InMemoryDataService } from '../storage/in-memory-data.service';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class PedidosService {
  constructor(private readonly data: InMemoryDataService) {}

  async findAll(user: TokenPayload): Promise<Pedido[]> {
    return this.data.orders
      .filter((order) => user.tipo_usuario === 'admin' || order.id_usuario === user.sub)
      .sort((a, b) => a.id_pedido - b.id_pedido);
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = this.data.orders.find((item) => item.id_pedido === id);
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }

  async findOneForUser(id: number, user: TokenPayload): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (user.tipo_usuario !== 'admin' && Number(pedido.id_usuario) !== Number(user.sub)) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const subtotal = this.roundMoney(createPedidoDto.subtotal);
    const desconto = this.roundMoney(createPedidoDto.desconto || 0);
    const isFreteGratis = subtotal >= FREE_SHIPPING_THRESHOLD;
    const valorFrete = isFreteGratis ? 0 : this.roundMoney(createPedidoDto.valor_frete);
    const total = this.roundMoney(subtotal - desconto + valorFrete);

    const pedido: Pedido = {
      ...createPedidoDto,
      id_pedido: this.data.nextId('order'),
      id_endereco: createPedidoDto.id_endereco || undefined,
      subtotal,
      desconto,
      valor_frete: valorFrete,
      total,
      frete_gratis: isFreteGratis,
      resumo_checkout:
        createPedidoDto.resumo_checkout ||
        ({ subtotal, frete: valorFrete, total } as Record<string, number>),
      endereco_entrega: createPedidoDto.endereco_entrega as unknown as Record<string, unknown>,
      itens: createPedidoDto.itens as unknown as Record<string, unknown>[],
      data_pedido: new Date(),
    } as Pedido;

    this.data.orders.push(pedido);
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updatePedidoDto);
    return pedido;
  }

  async remove(id: number): Promise<{ message: string }> {
    const index = this.data.orders.findIndex((item) => item.id_pedido === id);
    if (index < 0) throw new NotFoundException('Pedido não encontrado');
    this.data.orders.splice(index, 1);
    return { message: 'Pedido removido com sucesso' };
  }

  private roundMoney(value: number): number {
    return Number(Number(value || 0).toFixed(2));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPayload } from '../auth/token.util';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  async findAll(user: TokenPayload): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: user.tipo_usuario === 'admin' ? {} : { id_usuario: user.sub },
      order: { id_pedido: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido: id },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

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

    const resumoCheckout =
      createPedidoDto.resumo_checkout ||
      ({
        subtotal,
        frete: valorFrete,
        total,
      } as Record<string, number>);

    const payload: Partial<Pedido> = {
      ...createPedidoDto,
      id_endereco: createPedidoDto.id_endereco || undefined,
      subtotal,
      desconto,
      valor_frete: valorFrete,
      total,
      frete_gratis: isFreteGratis,
      resumo_checkout: resumoCheckout as unknown as Record<string, unknown>,
      endereco_entrega: createPedidoDto.endereco_entrega as unknown as Record<string, unknown>,
      itens: createPedidoDto.itens as unknown as Record<string, unknown>[],
    };

    const pedido = this.pedidoRepository.create(payload);
    return this.pedidoRepository.save(pedido);
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);

    Object.assign(pedido, updatePedidoDto);

    return this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<{ message: string }> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);

    return { message: 'Pedido removido com sucesso' };
  }

  private roundMoney(value: number): number {
    return Number(Number(value || 0).toFixed(2));
  }
}

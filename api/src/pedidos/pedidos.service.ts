import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPayload } from '../auth/token.util';
import { EntregaOpcao } from '../frete/entities/entrega-opcao.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ItemPedido } from './entities/item-pedido.entity';
import { Pedido } from './entities/pedido.entity';

const FREE_SHIPPING_THRESHOLD = 400;

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
    @InjectRepository(EntregaOpcao)
    private readonly entregaOpcaoRepository: Repository<EntregaOpcao>,
  ) {}

  async findAll(user: TokenPayload): Promise<Pedido[]> {
    const where = user.tipo_usuario === 'admin' ? {} : { id_usuario: user.sub };
    return this.pedidoRepository.find({
      where,
      relations: { itensPedido: true },
      order: { id_pedido: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido: id },
      relations: { itensPedido: true },
    });
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }

  async findOneForUser(id: number, user: TokenPayload): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (
      user.tipo_usuario !== 'admin' &&
      Number(pedido.id_usuario) !== Number(user.sub)
    ) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const subtotal = this.roundMoney(createPedidoDto.subtotal);
    const desconto = this.roundMoney(createPedidoDto.desconto || 0);
    const isFreteGratis = subtotal >= FREE_SHIPPING_THRESHOLD;
    const formaPagamento = String(createPedidoDto.forma_pagamento || '').toLowerCase();

    if (!['cartao', 'pix', 'boleto'].includes(formaPagamento)) {
      throw new BadRequestException('Forma de pagamento inválida');
    }

    const entregaSelecionada = createPedidoDto.id_entrega_opcao
      ? await this.entregaOpcaoRepository.findOne({
          where: { id_entrega_opcao: createPedidoDto.id_entrega_opcao, ativa: true },
        })
      : null;

    if (!isFreteGratis && !entregaSelecionada) {
      throw new BadRequestException(
        'Selecione uma opção de entrega para pedidos abaixo de R$ 400.',
      );
    }

    const valorFrete = isFreteGratis
      ? 0
      : this.roundMoney(createPedidoDto.valor_frete);
    const total = this.roundMoney(subtotal - desconto + valorFrete);

    const pedido = await this.pedidoRepository.save(
      this.pedidoRepository.create({
        id_usuario: createPedidoDto.id_usuario,
        id_endereco: createPedidoDto.id_endereco || undefined,
        id_pagamento: createPedidoDto.id_pagamento,
        id_entrega_opcao: entregaSelecionada?.id_entrega_opcao,
        status: createPedidoDto.status,
        subtotal,
        desconto,
        valor_frete: valorFrete,
        total,
        frete_gratis: isFreteGratis,
        origem_cep: createPedidoDto.origem_cep,
        prazo_entrega_min_dias: createPedidoDto.prazo_entrega_min_dias,
        prazo_entrega_max_dias: createPedidoDto.prazo_entrega_max_dias,
        forma_pagamento: formaPagamento,
        codigo_rastreio: createPedidoDto.codigo_rastreio,
        observacoes_entrega: createPedidoDto.observacoes_entrega,
        resumo_checkout:
          (createPedidoDto.resumo_checkout as unknown as Record<
            string,
            unknown
          >) ||
          ({ subtotal, frete: valorFrete, total } as Record<string, number>),
        endereco_entrega: createPedidoDto.endereco_entrega as unknown as Record<
          string,
          unknown
        >,
      }),
    );

    if (createPedidoDto.itens?.length) {
      await this.itemPedidoRepository.save(
        createPedidoDto.itens.map((item) =>
          this.itemPedidoRepository.create({
            id_pedido: pedido.id_pedido,
            id_produto: item.id_produto,
            id_produto_variacao: item.id_produto_variacao,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
            nome_produto: item.nome,
            nome_cor: item.cor,
            tamanho: item.tamanho,
          }),
        ),
      );
    }

    return this.findOne(pedido.id_pedido);
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updatePedidoDto);
    await this.pedidoRepository.save(pedido);
    return this.findOne(id);
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddItemCarrinhoDto } from './dto/add-item-carrinho.dto';
import { Carrinho } from './entities/carrinho.entity';
import { ItemCarrinho } from './entities/item-carrinho.entity';

@Injectable()
export class CarrinhoService {
  constructor(
    @InjectRepository(Carrinho)
    private readonly carrinhoRepository: Repository<Carrinho>,
    @InjectRepository(ItemCarrinho)
    private readonly itemCarrinhoRepository: Repository<ItemCarrinho>,
  ) {}

  async getCarrinhoByUsuario(idUsuario: number) {
    const carrinho = await this.ensureCarrinho(idUsuario);
    return this.carrinhoRepository.findOne({
      where: { id_carrinho: carrinho.id_carrinho },
      relations: { itens: true },
    });
  }

  async addItem(idUsuario: number, dto: AddItemCarrinhoDto) {
    const carrinho = await this.ensureCarrinho(idUsuario);

    const itemExistente = await this.itemCarrinhoRepository.findOne({
      where: {
        id_carrinho: carrinho.id_carrinho,
        id_produto: dto.id_produto,
        id_produto_variacao: dto.id_produto_variacao,
      },
    });

    if (itemExistente) {
      itemExistente.quantidade += dto.quantidade;
      itemExistente.preco_unitario = dto.preco_unitario;
      await this.itemCarrinhoRepository.save(itemExistente);
    } else {
      await this.itemCarrinhoRepository.save(
        this.itemCarrinhoRepository.create({
          id_carrinho: carrinho.id_carrinho,
          id_produto: dto.id_produto,
          id_produto_variacao: dto.id_produto_variacao,
          quantidade: dto.quantidade,
          preco_unitario: dto.preco_unitario,
        }),
      );
    }

    return this.getCarrinhoByUsuario(idUsuario);
  }

  async updateQuantidade(
    idUsuario: number,
    idItem: number,
    quantidade: number,
  ) {
    const carrinho = await this.ensureCarrinho(idUsuario);
    const item = await this.itemCarrinhoRepository.findOne({
      where: { id_item_carrinho: idItem, id_carrinho: carrinho.id_carrinho },
    });

    if (!item) throw new NotFoundException('Item do carrinho não encontrado');
    item.quantidade = quantidade;
    await this.itemCarrinhoRepository.save(item);
    return this.getCarrinhoByUsuario(idUsuario);
  }

  async removeItem(idUsuario: number, idItem: number) {
    const carrinho = await this.ensureCarrinho(idUsuario);
    const item = await this.itemCarrinhoRepository.findOne({
      where: { id_item_carrinho: idItem, id_carrinho: carrinho.id_carrinho },
    });

    if (!item) throw new NotFoundException('Item do carrinho não encontrado');
    await this.itemCarrinhoRepository.remove(item);
    return this.getCarrinhoByUsuario(idUsuario);
  }

  private async ensureCarrinho(idUsuario: number): Promise<Carrinho> {
    const existente = await this.carrinhoRepository.findOne({
      where: { id_usuario: idUsuario },
    });
    if (existente) return existente;

    return this.carrinhoRepository.save(
      this.carrinhoRepository.create({
        id_usuario: idUsuario,
      }),
    );
  }
}

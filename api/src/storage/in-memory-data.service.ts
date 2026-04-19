import { Injectable } from '@nestjs/common';
import { GiftCard } from '../gift-cards/entities/gift-card.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class InMemoryDataService {
  // Fonte temporária em memória.
  // TODO(db): substituir por repositórios TypeORM quando toda a API estiver 100% ligada ao PostgreSQL.
  users: Usuario[] = [];

  products: Produto[] = [
  {
    id_produto: 1,
    id_categoria: 3,
    nome: 'Nike Tênis Velocity Pro',
    descricao: 'Tênis de corrida com amortecimento responsivo.',
    preco: 499.9,
    genero: 'Masculino',
    ativo: true,
    destaque: true,
    marca: 'Nike',
    slug: 'nike-tenis-velocity-pro',
    media_avaliacao: 4.9,
    total_avaliacoes: 12,

    desconto: 10,               // 👈 ADICIONA
    promocao_ativa: true,      // 👈 ADICIONA

    created_at: new Date('2026-03-29T10:00:00.000Z'),
    updated_at: new Date('2026-03-29T10:00:00.000Z'),
    imagens: [],
    variacoes: [],
    cores: [],
    tamanhos: [],
  },
  {
    id_produto: 2,
    id_categoria: 2,
    nome: 'Adidas Legging Motion Fit',
    descricao: 'Legging de compressão com secagem rápida.',
    preco: 189.9,
    genero: 'Feminino',
    ativo: true,
    destaque: false,
    marca: 'Adidas',
    slug: 'adidas-legging-motion-fit',
    media_avaliacao: 4.8,
    total_avaliacoes: 18,

    desconto: 0,               // 👈 ADICIONA
    promocao_ativa: false,    // 👈 ADICIONA

    created_at: new Date('2026-03-25T10:00:00.000Z'),
    updated_at: new Date('2026-03-25T10:00:00.000Z'),
    imagens: [],
    variacoes: [],
    cores: [],
    tamanhos: [],
  },
];

  orders: Pedido[] = [];
  giftCards: GiftCard[] = [];

  private sequences = {
    user: 1,
    product: this.products.length + 1,
    order: 1,
    giftCard: 1,
  };

  nextId(kind: 'user' | 'product' | 'order' | 'giftCard'): number {
    const value = this.sequences[kind];
    this.sequences[kind] += 1;
    return value;
  }
}

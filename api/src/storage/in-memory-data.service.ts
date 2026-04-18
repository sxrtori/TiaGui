import { Injectable } from '@nestjs/common';
import { GiftCard } from '../gift-cards/entities/gift-card.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class InMemoryDataService {
  users: Usuario[] = [];
  products: Produto[] = [
    {
      id_produto: 1,
      id_categoria: 3,
      nome: 'Nike Tênis Velocity Pro',
      descricao: 'Tênis de corrida com amortecimento responsivo.',
      preco: 499.9,
      preco_promocional: 449.9,
      estoque: 15,
      imagem: 'https://m.media-amazon.com/images/I/81j4AXVz5tL._AC_SY575_.jpg',
      galeria_imagens: '',
      genero: 'Masculino',
      numeracao: '38,39,40,41,42',
      marca: 'Nike',
      slug: 'nike-tenis-velocity-pro',
      desconto: 10,
      cashback: 5,
      modalidade: 'Corrida',
      lancamento: true,
      promocao_ativa: true,
      id_vendedor: 1,
      ativo: true,
      media_avaliacao: 4.9,
      total_avaliacoes: 12,
      peso_kg: 0.8,
      altura_cm: 12,
      largura_cm: 23,
      comprimento_cm: 33,
      origem_cep: '01001-000',
      created_at: new Date('2026-03-29T10:00:00.000Z'),
    },
    {
      id_produto: 2,
      id_categoria: 2,
      nome: 'Adidas Legging Motion Fit',
      descricao: 'Legging de compressão com secagem rápida.',
      preco: 189.9,
      estoque: 24,
      imagem:
        'https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/calca-adidas-legging-3-stripes-feminina-gb4350-64ef58a2bd551.jpg',
      galeria_imagens: '',
      genero: 'Feminino',
      numeracao: 'P,M,G,GG',
      marca: 'Adidas',
      slug: 'adidas-legging-motion-fit',
      desconto: 0,
      cashback: 4,
      modalidade: 'Academia',
      lancamento: true,
      promocao_ativa: false,
      id_vendedor: 1,
      ativo: true,
      media_avaliacao: 4.8,
      total_avaliacoes: 18,
      peso_kg: 0.35,
      altura_cm: 6,
      largura_cm: 20,
      comprimento_cm: 30,
      origem_cep: '01001-000',
      created_at: new Date('2026-03-25T10:00:00.000Z'),
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

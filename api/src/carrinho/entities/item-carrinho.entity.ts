import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Carrinho } from './carrinho.entity';

@Entity('item_carrinho')
export class ItemCarrinho {
  @PrimaryGeneratedColumn({ name: 'id_item_carrinho' })
  id_item_carrinho: number;

  @Column({ name: 'id_carrinho' })
  id_carrinho: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'id_produto_variacao', nullable: true })
  id_produto_variacao?: number;

  @Column({ name: 'quantidade', type: 'int', default: 1 })
  quantidade: number;

  @Column({
    name: 'preco_unitario',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  preco_unitario: number;

  @Column({
    name: 'criado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  criado_em: Date;

  @Column({
    name: 'atualizado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  atualizado_em: Date;

  @ManyToOne(() => Carrinho, (carrinho) => carrinho.itens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_carrinho' })
  carrinho: Carrinho;
}

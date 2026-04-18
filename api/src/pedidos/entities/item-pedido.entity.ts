import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('item_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn({ name: 'id_item_pedido' })
  id_item_pedido: number;

  @Column({ name: 'id_pedido' })
  id_pedido: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'id_produto_variacao', nullable: true })
  id_produto_variacao?: number;

  @Column({ name: 'quantidade', type: 'int' })
  quantidade: number;

  @Column({ name: 'preco_unitario', type: 'decimal', precision: 10, scale: 2 })
  preco_unitario: number;

  @Column({ name: 'nome_produto', length: 150 })
  nome_produto: string;

  @Column({ name: 'nome_cor', length: 50, nullable: true })
  nome_cor?: string;

  @Column({ name: 'tamanho', length: 20, nullable: true })
  tamanho?: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.itensPedido, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;
}

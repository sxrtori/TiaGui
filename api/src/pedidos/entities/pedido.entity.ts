import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'id_pedido' })
  id_pedido: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'id_endereco', nullable: true })
  id_endereco?: number;

  @Column({ name: 'id_pagamento', nullable: true })
  id_pagamento?: number;

  @Column({ name: 'id_entrega_opcao', nullable: true })
  id_entrega_opcao?: number;

  @Column({
    name: 'data_pedido',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  data_pedido: Date;

  @Column({ name: 'status', length: 30, default: 'pendente' })
  status: string;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'valor_frete',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valor_frete: number;

  @Column({
    name: 'desconto',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  desconto: number;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'frete_gratis', type: 'boolean', default: false })
  frete_gratis: boolean;

  @Column({ name: 'origem_cep', length: 10, default: '01000-000' })
  origem_cep: string;

  @Column({ name: 'prazo_entrega_min_dias', type: 'int', nullable: true })
  prazo_entrega_min_dias?: number;

  @Column({ name: 'prazo_entrega_max_dias', type: 'int', nullable: true })
  prazo_entrega_max_dias?: number;

  @Column({ name: 'forma_pagamento', length: 30 })
  forma_pagamento: string;

  @Column({ name: 'codigo_rastreio', length: 100, nullable: true })
  codigo_rastreio?: string;

  @Column({ name: 'observacoes_entrega', type: 'text', nullable: true })
  observacoes_entrega?: string;

  @Column({ name: 'endereco_entrega', type: 'jsonb', nullable: true })
  endereco_entrega?: Record<string, unknown>;

  @Column({ name: 'resumo_checkout', type: 'jsonb', nullable: true })
  resumo_checkout?: Record<string, unknown>;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.pedido)
  itensPedido: ItemPedido[];
}

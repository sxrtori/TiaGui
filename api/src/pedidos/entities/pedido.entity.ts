import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column()
  id_usuario: number;

  @Column({ nullable: true })
  id_endereco?: number;

  @Column({ nullable: true })
  id_pagamento?: number;

  @Column({ nullable: true })
  id_entrega_opcao?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_pedido: Date;

  @Column({ length: 30, default: 'pendente' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor_frete: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  desconto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'boolean', default: false })
  frete_gratis: boolean;

  @Column({ length: 10, default: '01000-000' })
  origem_cep: string;

  @Column({ type: 'int', nullable: true })
  prazo_entrega_min_dias?: number;

  @Column({ type: 'int', nullable: true })
  prazo_entrega_max_dias?: number;

  @Column({ length: 30 })
  forma_pagamento: string;

  @Column({ length: 100, nullable: true })
  codigo_rastreio?: string;

  @Column({ type: 'text', nullable: true })
  observacoes_entrega?: string;

  @Column({ type: 'jsonb', nullable: true })
  endereco_entrega?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  itens?: Record<string, unknown>[];

  @Column({ type: 'jsonb', nullable: true })
  resumo_checkout?: Record<string, unknown>;
}

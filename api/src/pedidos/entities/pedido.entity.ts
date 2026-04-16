import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column()
  id_usuario: number;

  @Column()
  id_endereco: number;

  @Column({ nullable: true })
  id_pagamento: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_pedido: Date;

  @Column({ length: 30, default: 'pendente' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ length: 30 })
  forma_pagamento: string;
}
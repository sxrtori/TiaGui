import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pagamento')
export class Pagamento {
  @PrimaryGeneratedColumn({ name: 'id_pagamento' })
  id_pagamento: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ length: 30 })
  tipo: string;

  @Column({ length: 100, nullable: true })
  nome_titular: string;

  @Column({ length: 4, nullable: true })
  ultimos_digitos: string;

  @Column({ length: 20, nullable: true })
  bandeira: string;

  @Column({ type: 'text', nullable: true })
  token_gateway: string;

  @Column({ length: 20, default: 'pendente' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;
}

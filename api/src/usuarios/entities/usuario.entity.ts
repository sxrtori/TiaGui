import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 20, default: 'cliente' })
  tipo_usuario: string;

  @Column({ length: 14, nullable: true, unique: true })
  cpf?: string;

  @Column({ type: 'date', nullable: true })
  data_nascimento?: string;

  @Column({ type: 'boolean', default: false })
  vendedor_bloqueado: boolean;

  @Column({ type: 'boolean', default: false })
  cpf_bloqueado_venda: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  media_avaliacao_vendedor: number;

  @Column({ type: 'int', default: 0 })
  total_avaliacoes_vendedor: number;

  @Column({ type: 'text', nullable: true })
  motivo_bloqueio?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;
}

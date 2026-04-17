import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id_produto: number;

  @Column()
  id_categoria: number;

  @Column({ length: 150 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  preco_promocional?: number;

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @Column({ type: 'text', nullable: true })
  imagem: string;

  @Column({ type: 'text', nullable: true })
  galeria_imagens?: string;

  @Column({ length: 20, nullable: true })
  genero: string;

  @Column({ length: 50, nullable: true })
  numeracao: string;

  @Column({ length: 80, nullable: true })
  marca?: string;

  @Column({ length: 180, nullable: true, unique: true })
  slug?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  desconto: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cashback: number;

  @Column({ length: 80, nullable: true })
  modalidade?: string;

  @Column({ type: 'boolean', default: false })
  lancamento: boolean;

  @Column({ type: 'boolean', default: false })
  promocao_ativa: boolean;

  @Column({ type: 'int', nullable: true })
  id_vendedor?: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  media_avaliacao: number;

  @Column({ type: 'int', default: 0 })
  total_avaliacoes: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

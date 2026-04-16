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

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @Column({ type: 'text', nullable: true })
  imagem: string;

  @Column({ length: 20, nullable: true })
  genero: string;

  @Column({ length: 50, nullable: true })
  numeracao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;
}
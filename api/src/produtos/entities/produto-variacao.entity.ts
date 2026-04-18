import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from './produto.entity';
import { ProdutoCor } from './produto-cor.entity';
import { ProdutoTamanho } from './produto-tamanho.entity';

@Entity('produto_variacao')
export class ProdutoVariacao {
  @PrimaryGeneratedColumn({ name: 'id_produto_variacao' })
  id_produto_variacao: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'id_produto_cor', nullable: true })
  id_produto_cor?: number;

  @Column({ name: 'id_produto_tamanho', nullable: true })
  id_produto_tamanho?: number;

  @Column({ name: 'sku', length: 100, nullable: true })
  sku?: string;

  @Column({
    name: 'preco',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  preco?: number;

  @Column({ name: 'estoque', type: 'int', default: 0 })
  estoque: number;

  @Column({ name: 'numeracao', length: 50, nullable: true })
  numeracao?: string;

  @Column({
    name: 'peso_kg',
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0.3,
  })
  peso_kg: number;

  @Column({
    name: 'altura_cm',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 5,
  })
  altura_cm: number;

  @Column({
    name: 'largura_cm',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 20,
  })
  largura_cm: number;

  @Column({
    name: 'comprimento_cm',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 30,
  })
  comprimento_cm: number;

  @Column({ name: 'ativa', type: 'boolean', default: true })
  ativa: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Produto, (produto) => produto.variacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto' })
  produto: Produto;

  @ManyToOne(() => ProdutoCor, (cor) => cor.variacoes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto_cor' })
  cor?: ProdutoCor;

  @ManyToOne(() => ProdutoTamanho, (tamanho) => tamanho.variacoes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto_tamanho' })
  tamanho?: ProdutoTamanho;
}

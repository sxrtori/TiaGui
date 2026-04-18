import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from './produto.entity';
import { ProdutoImagem } from './produto-imagem.entity';
import { ProdutoVariacao } from './produto-variacao.entity';

@Entity('produto_cor')
export class ProdutoCor {
  @PrimaryGeneratedColumn({ name: 'id_produto_cor' })
  id_produto_cor: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'nome_cor', length: 50 })
  nome_cor: string;

  @Column({ name: 'codigo_hex', length: 7, nullable: true })
  codigo_hex?: string;

  @Column({ name: 'ordem', type: 'int', default: 0 })
  ordem: number;

  @Column({ name: 'ativa', type: 'boolean', default: true })
  ativa: boolean;

  @ManyToOne(() => Produto, (produto) => produto.cores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_produto' })
  produto: Produto;

  @OneToMany(() => ProdutoImagem, (imagem) => imagem.cor)
  imagens: ProdutoImagem[];

  @OneToMany(() => ProdutoVariacao, (variacao) => variacao.cor)
  variacoes: ProdutoVariacao[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { ProdutoCor } from './produto-cor.entity';
import { ProdutoImagem } from './produto-imagem.entity';
import { ProdutoTamanho } from './produto-tamanho.entity';
import { ProdutoVariacao } from './produto-variacao.entity';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'id_categoria' })
  id_categoria: number;

  @Column({ name: 'nome', length: 150 })
  nome: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string;

  @Column({ name: 'preco', type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ name: 'genero', length: 20, nullable: true })
  genero?: string;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @Column({ name: 'destaque', type: 'boolean', default: false })
  destaque: boolean;

  @Column({ name: 'marca', length: 100, nullable: true })
  marca?: string;

  @Column({ name: 'slug', length: 180, nullable: true })
  slug?: string;

  @Column({
    name: 'media_avaliacao',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  media_avaliacao: number;

  @Column({ name: 'total_avaliacoes', type: 'int', default: 0 })
  total_avaliacoes: number;

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

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
  @JoinColumn({ name: 'id_categoria' })
  categoria?: Categoria;

  @OneToMany(() => ProdutoImagem, (imagem) => imagem.produto)
  imagens: ProdutoImagem[];

  @OneToMany(() => ProdutoVariacao, (variacao) => variacao.produto)
  variacoes: ProdutoVariacao[];

  @OneToMany(() => ProdutoCor, (cor) => cor.produto)
  cores: ProdutoCor[];

  @OneToMany(() => ProdutoTamanho, (tamanho) => tamanho.produto)
  tamanhos: ProdutoTamanho[];

  @Column({ name: 'desconto', type: 'decimal', precision: 5, scale: 2, default: 0 })
  desconto: number;

  @Column({ name: 'promocao_ativa', type: 'boolean', default: false })
  promocao_ativa: boolean;
}

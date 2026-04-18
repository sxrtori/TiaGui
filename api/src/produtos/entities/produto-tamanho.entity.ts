import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from './produto.entity';
import { ProdutoVariacao } from './produto-variacao.entity';

@Entity('produto_tamanho')
export class ProdutoTamanho {
  @PrimaryGeneratedColumn({ name: 'id_produto_tamanho' })
  id_produto_tamanho: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'tamanho', length: 20 })
  tamanho: string;

  @Column({ name: 'ordem', type: 'int', default: 0 })
  ordem: number;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @ManyToOne(() => Produto, (produto) => produto.tamanhos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto' })
  produto: Produto;

  @OneToMany(() => ProdutoVariacao, (variacao) => variacao.tamanho)
  variacoes: ProdutoVariacao[];
}

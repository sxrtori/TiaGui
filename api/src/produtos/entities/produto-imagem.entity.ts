import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from './produto.entity';
import { ProdutoCor } from './produto-cor.entity';

@Entity('produto_imagem')
export class ProdutoImagem {
  @PrimaryGeneratedColumn({ name: 'id_produto_imagem' })
  id_produto_imagem: number;

  @Column({ name: 'id_produto' })
  id_produto: number;

  @Column({ name: 'id_produto_cor', nullable: true })
  id_produto_cor?: number;

  @Column({ name: 'url_imagem', type: 'text' })
  url_imagem: string;

  @Column({ name: 'alt_text', length: 255, nullable: true })
  alt_text?: string;

  @Column({ name: 'principal', type: 'boolean', default: false })
  principal: boolean;

  @Column({ name: 'ordem', type: 'int', default: 0 })
  ordem: number;

  @ManyToOne(() => Produto, (produto) => produto.imagens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto' })
  produto: Produto;

  @ManyToOne(() => ProdutoCor, (cor) => cor.imagens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto_cor' })
  cor?: ProdutoCor;
}

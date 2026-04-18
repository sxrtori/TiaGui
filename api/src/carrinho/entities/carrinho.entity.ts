import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCarrinho } from './item-carrinho.entity';

@Entity('carrinho')
export class Carrinho {
  @PrimaryGeneratedColumn({ name: 'id_carrinho' })
  id_carrinho: number;

  @Column({ name: 'id_usuario', unique: true })
  id_usuario: number;

  @Column({
    name: 'data_criacao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  data_criacao: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => ItemCarrinho, (item) => item.carrinho)
  itens: ItemCarrinho[];
}

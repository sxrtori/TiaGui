import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avaliacao')
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id_avaliacao: number;

  @Column()
  id_usuario: number;

  @Column()
  id_produto: number;

  @Column({ nullable: true })
  id_pedido?: number;

  @Column({ type: 'int' })
  nota: number;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ type: 'boolean', default: false })
  denunciada: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;
}

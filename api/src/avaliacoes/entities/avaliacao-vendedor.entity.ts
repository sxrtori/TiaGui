import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avaliacao_vendedor')
export class AvaliacaoVendedor {
  @PrimaryGeneratedColumn()
  id_avaliacao_vendedor: number;

  @Column({ type: 'int' })
  id_usuario: number;

  @Column({ type: 'int' })
  id_vendedor: number;

  @Column({ type: 'int' })
  nota: number;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;
}

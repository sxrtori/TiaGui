import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('entrega_opcao')
export class EntregaOpcao {
  @PrimaryGeneratedColumn({ name: 'id_entrega_opcao' })
  id_entrega_opcao: number;

  @Column({ name: 'nome', length: 50 })
  nome: string;

  @Column({ name: 'descricao', length: 150, nullable: true })
  descricao?: string;

  @Column({ name: 'prazo_min_dias', type: 'int' })
  prazo_min_dias: number;

  @Column({ name: 'prazo_max_dias', type: 'int' })
  prazo_max_dias: number;

  @Column({ name: 'valor_base', type: 'decimal', precision: 10, scale: 2 })
  valor_base: number;

  @Column({ name: 'valor_por_kg', type: 'decimal', precision: 10, scale: 2 })
  valor_por_kg: number;

  @Column({ name: 'ativa', type: 'boolean', default: true })
  ativa: boolean;

  @Column({ name: 'ordem', type: 'int', default: 0 })
  ordem: number;
}

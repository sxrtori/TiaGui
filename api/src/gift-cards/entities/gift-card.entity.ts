import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum GiftCardStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ENVIADO = 'enviado',
  USADO = 'usado',
  CANCELADO = 'cancelado',
}

@Entity('gift_card')
export class GiftCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true, nullable: true })
  codigo: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ length: 120 })
  nomeDestinatario: string;

  @Column({ length: 180 })
  emailDestinatario: string;

  @Column({ type: 'text', nullable: true })
  mensagem?: string;

  @Column({
    type: 'enum',
    enum: GiftCardStatus,
    default: GiftCardStatus.PENDENTE,
  })
  status: GiftCardStatus;

  @Column({ length: 255, nullable: true })
  stripeSessionId?: string;

  @Column({ length: 255, nullable: true })
  stripePaymentIntentId?: string;

  @Column({ type: 'timestamp', nullable: true })
  dataPagamento?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataEnvio?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp' })
  dataCriacao: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  dataAtualizacao: Date;
}

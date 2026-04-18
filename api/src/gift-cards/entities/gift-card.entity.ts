import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum GiftCardStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ENVIADO = 'enviado',
  USADO = 'usado',
  CANCELADO = 'cancelado',
}

@Entity('gift_card')
export class GiftCard {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'codigo', type: 'varchar', length: 32, unique: true, nullable: true })
  codigo?: string | null;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ name: 'nome_destinatario', length: 120 })
  nomeDestinatario: string;

  @Column({ name: 'email_destinatario', length: 180 })
  emailDestinatario: string;

  @Column({ name: 'mensagem', type: 'text', nullable: true })
  mensagem?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: GiftCardStatus.PENDENTE,
  })
  status: GiftCardStatus;

  @Column({ name: 'stripe_session_id', length: 255, nullable: true })
  stripeSessionId?: string;

  @Column({ name: 'stripe_payment_intent_id', length: 255, nullable: true })
  stripePaymentIntentId?: string;

  @Column({ name: 'data_pagamento', type: 'timestamp', nullable: true })
  dataPagamento?: Date;

  @Column({ name: 'data_envio', type: 'timestamp', nullable: true })
  dataEnvio?: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({
    name: 'webhook_event_ids',
    type: 'text',
    array: true,
    default: '{}',
  })
  webhookEventIds: string[];

  @CreateDateColumn({ name: 'data_criacao', type: 'timestamp' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao', type: 'timestamp' })
  dataAtualizacao: Date;
}

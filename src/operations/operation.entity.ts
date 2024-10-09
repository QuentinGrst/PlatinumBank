import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { Dab } from '../dab/dab.entity';
import { Transfer } from '../transfers/transfer.entity';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, { eager: true, nullable: false })
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @ManyToOne(() => Dab, { eager: true, nullable: false })
  @JoinColumn({ name: 'dabId' })
  dab: Dab;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'boolean', nullable: true })
  isWithdrawal: boolean;

  @ManyToOne(() => Transfer, { eager: true, nullable: true })
  @JoinColumn({ name: 'transferId' })
  transfer: Transfer;
}

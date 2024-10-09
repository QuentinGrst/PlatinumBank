import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, { eager: true, nullable: false })
  @JoinColumn({ name: 'fromAccId' })
  fromAcc: Account;

  @ManyToOne(() => Account, { eager: true, nullable: false })
  @JoinColumn({ name: 'toAccId' })
  toAcc: Account;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}

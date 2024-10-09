import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionType: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @Column({ nullable: true })
  destinationAccountId: number;

  @CreateDateColumn()
  createdAt: Date;
}

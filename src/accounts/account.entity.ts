import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountType: string;

  @Column({ type: 'float' })
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @ManyToOne(() => User, { nullable: true })
  secondHolder: User;
}

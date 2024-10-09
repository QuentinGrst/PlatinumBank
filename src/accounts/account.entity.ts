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
import { AccountType } from './account-type.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.COURANT,
  })
  accountType: AccountType;

  @Column({ type: 'float' })
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts, { eager: true })
  user: User;

  @ManyToOne(() => User, (user) => user.secondaryAccounts, {
    eager: true,
    nullable: true,
  })
  secondHolder: User;

  @OneToMany(() => Card, (card) => card.account, { cascade: true })
  cards: Card[];
}

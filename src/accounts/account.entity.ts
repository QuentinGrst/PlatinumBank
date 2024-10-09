import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { AccountType } from './account-type.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Column({ type: 'float' })
  balance: number;

  @ManyToMany(() => User, (user) => user.accounts, { cascade: true })
  @JoinTable({ name: 'account_users' }) // Table de jonction pour relier utilisateurs et comptes
  users: User[];

  @OneToMany(() => Card, (card) => card.account, { cascade: true })
  cards: Card[];
}

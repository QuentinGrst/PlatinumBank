import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @ManyToOne(() => User, { nullable: true })
  secondHolder: User;
}

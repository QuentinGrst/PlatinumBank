import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Card } from '../cards/card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Account, (account) => account.secondHolder)
  secondaryAccounts: Account[];
}

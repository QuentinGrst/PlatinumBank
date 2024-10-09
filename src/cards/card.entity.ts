import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNumber: string;

  @Column()
  pinCode: string;

  @Column()
  cardHolderName: string;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @Column({ default: 0 })
  dailyWithdrawalLimit: number;

  @Column({ default: false })
  isBlocked: boolean;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../accounts/account.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNumber: string;

  @Column()
  pinCode: string;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @BeforeInsert()
  async generateCardNumber() {
    this.cardNumber = '5131' + Math.random().toString().slice(2, 14);
  }

  @BeforeInsert()
  async hashPinCode() {
    const salt = await bcrypt.genSalt();
    this.pinCode = await bcrypt.hash(this.pinCode, salt);
  }
}

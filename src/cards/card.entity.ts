import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { IsNumberString, Length } from 'class-validator';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumberString(
    { no_symbols: true },
    { message: 'Doit contenir des chiffres uniquement' },
  )
  @Length(16, 16, {
    message: 'Le numéro de carte doit avoir exactement 16 chiffres.',
  })
  cardNumber: string;

  @Column()
  @IsNumberString(
    { no_symbols: true },
    { message: 'Doit contenir des chiffres uniquement' },
  )
  @Length(4, 4, { message: 'Le code PIN doit avoir exactement 4 chiffres.' })
  pinCode: string;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'decimal', default: 500.0, precision: 10, scale: 2 })
  withdrawalLimit: number;

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

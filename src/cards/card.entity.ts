import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { IsNumberString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumberString({ no_symbols: true }, { message: 'Doit contenir des chiffres uniquement' })
  @Length(16, 16, { message: 'Le numéro de carte doit avoir exactement 16 chiffres.' })
  cardNumber: string;

  @Column()
  @IsNumberString({ no_symbols: true }, { message: 'Doit contenir des chiffres uniquement' })
  @Length(4, 4, { message: 'Le code PIN doit avoir exactement 4 chiffres.' })
  pinCode: string;

  @Column()
  cardHolderName: string;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 0 })
  dailyWithdrawalLimit: number;

  @Column({ default: false })
  isBlocked: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPinCode() {
    if (this.pinCode) {
      this.pinCode = await bcrypt.hash(this.pinCode, 10);
    }
  }
}

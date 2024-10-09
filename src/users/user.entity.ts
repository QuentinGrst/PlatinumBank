import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';

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

  @ManyToMany(() => Account, (account) => account.users)
  accounts: Account[];
}

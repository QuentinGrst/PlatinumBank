import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Account } from './accounts/account.entity';
import { Card } from './cards/card.entity';
import { Transaction } from './transactions/transaction.entity';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CardsModule } from './cards/cards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DabModule } from './dab/dab.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'platinium_bank',
      entities: [User, Account, Card, Transaction],
      synchronize: true,
    }),
    UsersModule,
    AccountsModule,
    CardsModule,
    TransactionsModule,
    DabModule,
    AuthModule,
  ],
})
export class AppModule {}

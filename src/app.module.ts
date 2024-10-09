import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Account } from './accounts/account.entity';
import { Card } from './cards/card.entity';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CardModule } from './cards/card.module';
import { DabModule } from './dab/dab.module';
import { AuthModule } from './auth/auth.module';
import { Operation } from './operations/operation.entity';
import { Dab } from './dab/dab.entity';
import { Transfer } from './transfers/transfer.entity';
import { OperationModule } from './operations/operation.module';
import { TransferModule } from './transfers/transfer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'platinium_bank',
      password: 'root',
      database: 'platinium_bank',
      entities: [User, Account, Card, Operation, Dab, Transfer],
      synchronize: true,
    }),
    UsersModule,
    AccountsModule,
    CardModule,
    DabModule,
    AuthModule,
    OperationModule,
    TransferModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DabService } from './dab.service';
import { DabController } from './dab.controller';
import { Card } from '../cards/card.entity';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { Operation } from '../operations/operation.entity';
import { Transfer } from '../transfers/transfer.entity'; // Import de l'entité Transfer
import { CardService } from '../cards/card.service';
import { AccountService } from '../accounts/account.service';
import { OperationService } from '../operations/operation.service';
import { TransferService } from '../transfers/transfer.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Account, User, Operation, Transfer]),
    UsersModule,
  ],
  providers: [
    DabService,
    CardService,
    AccountService,
    OperationService,
    TransferService,
  ],
  controllers: [DabController],
})
export class DabModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Account } from '../accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, Account])],
  providers: [TransferService],
  controllers: [TransferController],
  exports: [TransferService],
})
export class TransferModule {}

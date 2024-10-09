import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Account } from '../accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Account])],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { Card } from '../cards/card.entity';
import { Dab } from '../dab/dab.entity';
import { Transfer } from '../transfers/transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Card, Dab, Transfer])],
  providers: [OperationService],
  controllers: [OperationController],
  exports: [OperationService],
})
export class OperationModule {}
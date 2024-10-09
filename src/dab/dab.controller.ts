import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DabService } from './dab.service';
import { Operation } from '../operations/operation.entity';
import { Transfer } from '../transfers/transfer.entity';

@Controller('dab')
export class DabController {
  constructor(private readonly dabService: DabService) {}

  @Post('login')
  async login(
    @Body('cardNumber') cardNumber: string,
    @Body('pinCode') pinCode: string,
  ) {
    return this.dabService.authenticateCard(cardNumber, pinCode);
  }

  @Get('accounts/:userId')
  async getAccounts(@Param('userId') userId: number) {
    return this.dabService.getUserAccounts(userId);
  }

  @Get('operations/:cardId')
  async getOperations(@Param('cardId') cardId: number): Promise<Operation[]> {
    return this.dabService.getLast10Operations(cardId);
  }

  @Post('withdraw')
  async withdraw(
    @Body('cardId') cardId: number,
    @Body('amount') amount: number,
  ): Promise<Operation> {
    return this.dabService.withdraw(cardId, amount);
  }

  @Post('transfer')
  async transfer(
    @Body('fromAccountId') fromAccountId: number,
    @Body('toAccountId') toAccountId: number,
    @Body('amount') amount: number,
  ): Promise<Transfer> {
    return this.dabService.transfer(fromAccountId, toAccountId, amount);
  }
}

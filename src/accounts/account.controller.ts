import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body('userId') userId: number,
    @Body('secondUserId') secondUserId: number,
    @Body('accountType') accountType: string,
    @Body('pinCode') pinCode: string,
  ): Promise<Account> {
    const userIds: number[] = secondUserId ? [userId, secondUserId] : [userId];

    return this.accountService.createAccount(userIds, accountType, pinCode);
  }

  // Route pour récupérer un compte par ID
  @Get(':id')
  async getAccount(@Param('id') id: number) {
    return this.accountService.findAccountById(id);
  }

  // Route pour mettre à jour un compte
  @Put(':id')
  async updateAccount(
    @Param('id') id: number,
    @Body('balance') balance: number,
  ) {
    return this.accountService.updateAccount(id, balance);
  }

  // Route pour supprimer un compte
  @Delete(':id')
  async deleteAccount(@Param('id') id: number) {
    return this.accountService.removeAccount(id);
  }
}

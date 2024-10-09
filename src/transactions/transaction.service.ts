import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/accounts/account.service';
import { Transaction } from './transaction.entity';
import { DabService } from 'src/dab/dab.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private accountService: AccountService,
    private dabService: DabService,
  ) {}

  async withdrawMoney(
    atmId: number,
    accountId: number,
    amount: number,
  ): Promise<string> {
    const atm = await this.dabService.findById(atmId);
    const account = await this.accountService.findAccountById(accountId);

    if (!atm) {
      throw new NotFoundException("Le DAB n'existe pas");
    }

    if (!account) {
      throw new NotFoundException("Le compte spécifié n'existe pas");
    }

    this.accountService.updateAccount(account.id, account.balance - amount);

    return `Le retrait de  ${amount}€ sur le compte ${accountId} a bien été enregistré.`;
  }

  async transferMoney(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ) {
    const fromAccount =
      await this.accountService.findAccountById(fromAccountId);
    const toAccount = await this.accountService.findAccountById(toAccountId);

    if (fromAccount.user !== toAccount.user) {
      throw new BadRequestException(
        "Les virements ne sont possible qu'entre les comptes d'un seul et même client",
      );
    }

    this.accountService.updateAccount(
      fromAccountId,
      fromAccount.balance - amount,
    );
    this.accountService.updateAccount(toAccountId, toAccount.balance + amount);
  }

  async checkDeposit(toAccountId: number, amount: number, delayHours: number) {
    console.log(toAccountId, amount, delayHours);
  }
}

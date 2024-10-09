import { Injectable } from '@nestjs/common';
import { Dab } from './entities/dab.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from 'src/accounts/account.service';
import { Account } from 'src/accounts/account.entity';
import { UsersService } from 'src/users/users.service';
import { CardService } from 'src/cards/card.service';

@Injectable()
export class DabService {
  constructor(
    @InjectRepository(Dab)
    private dabRepository: Repository<Dab>,
    private accountService: AccountService,
    private cardService: CardService,
  ) {}

  async connectUser(cardNumber: string, pin: number): any {
    console.log(this.cardService.findByCardNumber(cardNumber));
    return Error();
  }

  async findById(id: number): Promise<Dab> {
    return await this.dabRepository.findOne({ where: { id: id } });
  }

  async getUserAccounts(userId: number): Promise<Account[]> {
    return this.accountService.findAccountByUserID(userId);
  }
  async getUserAccounts(userId: number): Promise<Account[]> {
    return this.accountService.findAccountByUserID(userId);
  }

  // async getLastTransactions(
  //   accountId: number,
  //   limit: number = 10,
  // ): Promise<any> {
  //   return Error();
  // }
}

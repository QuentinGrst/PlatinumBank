import { Injectable } from '@nestjs/common';
import { Dab } from './entities/dab.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DabService {
  constructor(
    @InjectRepository(Dab)
    private dabRepository: Repository<Dab>,
  ) {}

  async findById(id: number): Promise<Dab> {
    return await this.dabRepository.findOne({ where: { id: id } });
    // return `This action returns a #${id} dab`;
  }

  // async getUserAccounts(userId: number): Promise<any> {
  //   //Promise<Account[]> {
  //   return Error();
  // }

  // async getLastTransactions(
  //   accountId: number,
  //   limit: number = 10,
  // ): Promise<any> {
  //   return Error();
  // }

  // async withdrawMoney(
  //   atmId: number,
  //   accountId: number,
  //   amount: number,
  // ): Promise<string> {
  //   const atm = await this.findOne(atmId);
  //   const account = null; //await this.accountsService.findOne(accountId);

  //   if (!atm) {
  //     throw new NotFoundException("Le DAB n'existe pas");
  //   }

  //   if (!account) {
  //     throw new NotFoundException("Le compte spécifié n'existe pas");
  //   }

  //   return `Le retrait de  ${amount}€ sur le compte ${accountId} a bien été enregistré.`;
  // }

  // async transferMoney(
  //   fromAccountId: number,
  //   toAccountId: number,
  //   amount: number,
  // ) {
  //   const fromAccount = await this.accountService.findOneBy(fromAccountId);
  //   const toAccount = await this.accountService.findOneBy(toAccountId);

  //   if (fromAccount.userId !== toAccount.user) {
  //     throw new BadRequestException(
  //       "Les virements ne sont possible qu'entre les comptes d'un seul et même client",
  //     );
  //   }
  // }
}

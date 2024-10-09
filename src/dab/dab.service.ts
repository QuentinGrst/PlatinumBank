import { Injectable, NotFoundException } from '@nestjs/common';
import { Dab } from './entities/dab.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DabService {
  constructor(
    @InjectRepository(Dab)
    private dabRepository: Repository<Dab>,
  ) {}

  async findOne(id: number): Promise<Dab> {
    return await this.dabRepository.findOne({ where: { id: id } });
    // return `This action returns a #${id} dab`;
  }

  async getUserAccounts(userId: number): Promise<any> {
    //Promise<Account[]> {
    return Error();
  }

  async getLastTransactions(
    accountId: number,
    limit: number = 10,
  ): Promise<any> {
    return Error();
  }

  async withdrawMoney(
    atmId: number,
    accountId: number,
    amount: number,
  ): Promise<string> {
    const atm = await this.findOne(atmId);
    //const account = await this.accountsService.findOne(accountId);

    if (!atm) {
      throw new NotFoundException("Le DAB n'existe pas");
    }

    return `Withdrawal of ${amount} successful.`;
  }
}

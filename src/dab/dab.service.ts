import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/card.entity';
import { Account } from '../accounts/account.entity';
import { Operation } from '../operations/operation.entity';
import { Transfer } from '../transfers/transfer.entity';
import { CardService } from '../cards/card.service';
import { AccountService } from '../accounts/account.service';
import { OperationService } from '../operations/operation.service';
import { TransferService } from '../transfers/transfer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DabService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>, // Ajout pour corriger l'erreur
    private cardService: CardService,
    private accountService: AccountService,
    private operationService: OperationService,
    private transferService: TransferService,
  ) {}

  async validatePin(card: Card, pinCode: string): Promise<boolean> {
    return await bcrypt.compare(pinCode, card.pinCode);
  }

  async authenticateCard(cardNumber: string, pinCode: string): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { cardNumber } });
    if (!card) {
      throw new NotFoundException('Carte introuvable');
    }
    const isPinValid = await this.validatePin(card, pinCode);
    if (!isPinValid) {
      throw new BadRequestException('Code PIN invalide');
    }
    return card;
  }

  async getUserAccounts(userId: number): Promise<Account[]> {
    return this.accountRepository.find({
      where: {
        users: { id: userId },
      },
      relations: ['users'],
    });
  }

  async findOperationsByCardId(
    cardId: number,
    limit: number,
  ): Promise<Operation[]> {
    return this.operationRepository.find({
      where: { card: { id: cardId } },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async getLast10Operations(cardId: number): Promise<Operation[]> {
    return this.findOperationsByCardId(cardId, 10);
  }

  async withdraw(cardId: number, amount: number): Promise<Operation> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['account'],
    });
    if (!card) {
      throw new NotFoundException('Carte introuvable.');
    }
    const account = card.account;
    if (account.balance < amount) {
      throw new BadRequestException('Solde insuffisant.');
    }
    account.balance -= amount;
    await this.accountRepository.save(account);

    const operation = await this.operationService.createOperation({
      card,
      dab: null,
      amount,
      isWithdrawal: true,
    });

    return operation;
  }

  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ): Promise<Transfer> {
    return this.transferService.createTransfer({
      fromAcc: { id: fromAccountId } as Account,
      toAcc: { id: toAccountId } as Account,
      amount,
    });
  }
}

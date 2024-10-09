import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { Account, AccountType } from '../accounts/account.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createCard(card: Partial<Card>): Promise<Card> {
    const account = await this.accountRepository.findOne({
      where: { id: card.account.id },
      relations: ['cards'],
    });

    if (!account) {
      throw new BadRequestException("Le compte n'a pas été trouvé");
    } 

    if (account.accountType === AccountType.LIVRET_A) {
      throw new BadRequestException('La carte ne peut pas être associée à ce type de compte');
    } 

    if  (card.user.id !== account.user.id) {
      throw new BadRequestException('La carte doit appartenir au même utilisateur que le compte');
    } 

    if ((account.accountType !== AccountType.COMMUN && account.cards.length >= 1) || (account.accountType === AccountType.COMMUN && account.cards.length >= 2)) {
      throw new BadRequestException('Le nombre max de cartes a été atteint pour ce compte');
    }

    if (account.accountType === AccountType.COMMUN) {
      const cardOwners = account.cards.map(card => card.user.id);
    
      const userAlreadyHasCard = cardOwners.includes(card.user.id);
      if (userAlreadyHasCard) {
        throw new BadRequestException("Une carte max par utilisateur par compte");
      }
    }
    
    const newCard = this.cardRepository.create(card);
    return this.cardRepository.save(newCard);
  }
}

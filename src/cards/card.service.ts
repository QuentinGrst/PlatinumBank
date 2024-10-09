import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { Account } from '../accounts/account.entity';
import { AccountType } from '../accounts/account-type.enum';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  private async checkCard(card: Partial<Card>): Promise<void> {
    // Récupérer le compte associé avec les utilisateurs et les cartes
    const account = await this.accountRepository.findOne({
      where: { id: card.account.id },
      relations: ['users', 'cards'], // Charger les utilisateurs associés au compte
    });

    if (!account) {
      throw new BadRequestException("Le compte n'a pas été trouvé.");
    }

    // Vérifier le type de compte
    if (account.accountType === AccountType.LIVRET_A) {
      throw new BadRequestException(
        'La carte ne peut pas être associée à ce type de compte.',
      );
    }

    // Vérifier que l'utilisateur de la carte est bien associé au compte
    const isUserAssociated = account.users.some(
      (user) => user.id === card.user.id,
    );
    if (!isUserAssociated) {
      throw new BadRequestException(
        'La carte doit appartenir à un utilisateur associé au compte.',
      );
    }

    // Vérifier le nombre maximum de cartes
    const maxCards = account.accountType === AccountType.COMMUN ? 2 : 1;
    if (account.cards.length >= maxCards) {
      throw new BadRequestException(
        'Le nombre max de cartes a été atteint pour ce compte.',
      );
    }

    // Vérifier qu'un utilisateur ne possède qu'une seule carte dans le compte COMMUN
    if (account.accountType === AccountType.COMMUN) {
      const cardOwners = account.cards.map(
        (existingCard) => existingCard.user.id,
      );
      const userAlreadyHasCard = cardOwners.includes(card.user.id);

      if (userAlreadyHasCard) {
        throw new BadRequestException(
          'Chaque utilisateur ne peut avoir qu’une seule carte pour ce compte commun.',
        );
      }
    }
  }

  async createCard(card: Partial<Card>): Promise<Card> {
    await this.checkCard(card);
    const newCard = this.cardRepository.create(card);
    return this.cardRepository.save(newCard);
  }

  async updateCard(id: number, cardData: Partial<Card>): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!card) {
      throw new BadRequestException(
        `La carte avec l'ID ${id} n'a pas été trouvée`,
      );
    }

    await this.checkCard({ ...cardData, account: card.account });
    Object.assign(card, cardData);
    return this.cardRepository.save(card);
  }

  async findAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['account'] });
  }

  async findById(id: number): Promise<Card> {
    return this.cardRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async findByCardNumber(cardNumber: string): Promise<Card> {
    return this.cardRepository.findOne({
      where: { cardNumber: cardNumber },
      relations: ['account'],
    });
  }

  async deleteCard(id: number): Promise<void> {
    const result = await this.cardRepository.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException(
        `La carte avec l'ID ${id} n'a pas été trouvée`,
      );
    }
  }
}

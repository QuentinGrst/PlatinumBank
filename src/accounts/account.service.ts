import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { AccountType } from './account-type.enum';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  // Créer un compte avec des utilisateurs associés
  async createAccount(
    userIds: number[], // Un tableau d'identifiants d'utilisateurs
    accountType: string,
    pinCode?: string,
  ): Promise<Account> {
    if (!Object.values(AccountType).includes(accountType as AccountType)) {
      throw new BadRequestException(
        `Le type de compte doit être l'une des valeurs suivantes : ${Object.values(AccountType).join(', ')}`,
      );
    }

    // Vérifier que le nombre d'utilisateurs correspond au type de compte
    if (accountType !== AccountType.COMMUN && userIds.length !== 1) {
      throw new BadRequestException(
        'Les comptes de type non COMMUN doivent avoir un seul utilisateur.',
      );
    }

    if (accountType === AccountType.COMMUN && userIds.length !== 2) {
      throw new BadRequestException(
        'Le compte de type COMMUN doit avoir exactement deux utilisateurs.',
      );
    }

    // Récupérer les utilisateurs à partir de leurs identifiants
    const users = await this.usersRepository.findByIds(userIds);

    if (users.length !== userIds.length) {
      throw new BadRequestException(
        'Un ou plusieurs utilisateurs sont introuvables.',
      );
    }

    // Vérifier que les utilisateurs n'ont pas déjà un compte de ce type
    for (const user of users) {
      const existingAccount = await this.accountsRepository.findOne({
        where: {
          users: { id: user.id },
          accountType: accountType as AccountType,
        },
      });
      if (existingAccount) {
        throw new BadRequestException(
          `L'utilisateur ${user.name} possède déjà un compte de type ${accountType}.`,
        );
      }
    }

    // Créer et enregistrer le compte avec les utilisateurs associés
    const account = this.accountsRepository.create({
      accountType: accountType as AccountType,
      balance: 0,
      users, // Associer les utilisateurs au compte
    });

    // Si un PIN est fourni, créer une carte associée
    if (pinCode) {
      const card = this.cardsRepository.create({
        pinCode,
        account,
        user: users[0], // Associer la carte au premier utilisateur (par défaut)
      });

      await this.cardsRepository.save(card);
      account.cards = [card];
    }

    return this.accountsRepository.save(account);
  }

  // Récupérer un compte par ID
  async findAccountById(id: number): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['users', 'cards'],
    });
    if (!account) {
      throw new NotFoundException('Compte introuvable.');
    }
    return account;
  }

  // Récupérer un compte par id de user
  async findAccountByUserID(id: number): Promise<Account[]> {
    const account = await this.accountsRepository.find({
      where: { user: { id: id } },
    });
    if (!account) {
      throw new NotFoundException('Compte introuvable.');
    }
    return account;
  }

  // Mettre à jour le solde d'un compte
  async updateAccount(id: number, balance: number): Promise<void> {
    const account = await this.accountsRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Compte introuvable.');
    }
    account.balance = balance;
    await this.accountsRepository.save(account);
  }

  // Supprimer un compte
  async removeAccount(id: number): Promise<void> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['cards', 'users'],
    });
    if (!account) {
      throw new NotFoundException('Compte introuvable.');
    }
    await this.accountsRepository.remove(account);
  }
}

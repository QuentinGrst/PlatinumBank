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

  // Créer un compte avec une carte
  async createAccount(
    userId: number,
    accountType: string,
    pinCode: string,
  ): Promise<Account> {
    // Vérifier que le type de compte est valide
    if (!Object.values(AccountType).includes(accountType as AccountType)) {
      throw new BadRequestException(
        `Le type de compte doit être l'une des valeurs suivantes : ${Object.values(AccountType).join(', ')}`,
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable.');
    }

    // Vérifier que l'utilisateur ne possède pas déjà un compte de ce type
    const existingAccount = await this.accountsRepository.findOne({
      where: { user: { id: userId }, accountType: accountType as AccountType },
    });
    if (existingAccount) {
      throw new BadRequestException(
        `L'utilisateur possède déjà un compte de type ${accountType}.`,
      );
    }

    // Vérifier que le code PIN est renseigné
    if (!pinCode) {
      throw new BadRequestException('Le code PIN est obligatoire.');
    }

    // Créer et enregistrer le compte
    const account = this.accountsRepository.create({
      user,
      accountType: accountType as AccountType,
      balance: 0,
    });

    // Créer et associer la carte au compte
    const card = this.cardsRepository.create({
      pinCode,
    });

    account.cards = [card];

    // Enregistrer la carte et le compte dans la base de données
    await this.cardsRepository.save(card);
    return this.accountsRepository.save(account);
  }

  // Récupérer un compte par ID
  async findAccountById(id: number): Promise<Account> {
    const account = await this.accountsRepository.findOne({ where: { id } });
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
    const account = await this.accountsRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Compte introuvable.');
    }
    await this.accountsRepository.remove(account);
  }
}

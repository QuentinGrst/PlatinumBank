import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Operation } from './operation.entity';
import { Card } from '../cards/card.entity';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule'; // Ajout de l'import nécessaire
import { Dab } from 'src/dab/dab.entity';

@Injectable()
export class OperationService {
  private pendingDeposits = new Map<number, { operation: Partial<Operation>; date: Date }>();


  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Dab)
    private readonly dabRepository: Repository<Dab>,
  ) {}

  async createOperation(operationData: Partial<Operation>): Promise<Operation> {
    this.validateOperationData(operationData);

    // Vérifier si le plafond de retrait est respecté
    if (operationData.isWithdrawal) {
      await this.checkWithdrawalLimit(operationData);
    }

    const operation = this.operationRepository.create(operationData);
    return this.operationRepository.save(operation);
  }

  async findAllOperations(): Promise<Operation[]> {
    return this.operationRepository.find();
  }

  async findOperationById(id: number): Promise<Operation> {
    const operation = await this.operationRepository.findOne({ where: { id } });
    if (!operation) {
      throw new NotFoundException(`Operation with ID ${id} not found`);
    }
    return operation;
  }

  async updateOperation(
    id: number,
    operationData: Partial<Operation>,
  ): Promise<Operation> {
    this.validateOperationData(operationData);

    if (operationData.isWithdrawal) {
      await this.checkWithdrawalLimit(operationData);
    }

    const operation = await this.findOperationById(id);
    Object.assign(operation, operationData);
    return this.operationRepository.save(operation);
  }

  async deleteOperation(id: number): Promise<void> {
    const result = await this.operationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Operation with ID ${id} not found`);
    }
  }

  private validateOperationData(operationData: Partial<Operation>): void {
    const { amount, transfer } = operationData;

    if (amount !== undefined && transfer !== undefined) {
      throw new BadRequestException(
        'Une opération ne peut pas avoir à la fois un `amount` et un `transfer`.',
      );
    }

    if (amount !== undefined) {
      operationData.transfer = null;
    }

    if (transfer !== undefined) {
      operationData.amount = null;
      operationData.isWithdrawal = null;
    }
  }

  // Vérifier si le plafond de retrait est respecté
  private async checkWithdrawalLimit(operationData: Partial<Operation>): Promise<void> {
    const { card, amount } = operationData;

    const cardEntity = await this.cardRepository.findOne({ where: { id: card.id } });

    if (!cardEntity) {
      throw new NotFoundException('La carte spécifiée est introuvable.');
    }

    const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();

    const withdrawalOperations = await this.operationRepository.find({
      where: {
        card: { id: cardEntity.id },
        isWithdrawal: true,
        date: MoreThanOrEqual(twentyFourHoursAgo),
      },
    });

    const totalWithdrawn = withdrawalOperations.reduce((total, op) => total + Number(op.amount || 0), 0);

    const newTotalWithdrawn = totalWithdrawn + (amount || 0);

    if (newTotalWithdrawn > cardEntity.withdrawalLimit) {
      throw new BadRequestException(
        `Le plafond de retrait de ${cardEntity.withdrawalLimit} a été dépassé. Total retiré sur 24 heures : ${newTotalWithdrawn}`,
      );
    }
  }

  // Méthode pour initier un dépôt de chèque
  async depositCheque(cardId: number, amount: number): Promise<string> {
    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundException('Carte introuvable.');
    }
  
    const dab = await this.dabRepository.findOne({ where: { id: 1 } });
    if (!dab) {
      throw new NotFoundException('DAB introuvable.');
    }
  
    // Créer un objet `Partial<Operation>` pour le stocker dans `pendingDeposits`
    const operationData: Partial<Operation> = {
      card,
      dab,
      amount,
      isWithdrawal: false,
      date: new Date(),
    };
  
    // Ajouter `operation` et `date` à `pendingDeposits`
    const depositId = Date.now();
    this.pendingDeposits.set(depositId, { operation: operationData, date: new Date() });
  
    return `Dépôt de ${amount} initié pour la carte ${card.cardNumber}. L'opération sera ajoutée automatiquement dans 1 minute.`;
  }
  
  
  @Cron(CronExpression.EVERY_MINUTE)
  async processPendingDeposits(): Promise<void> {
    const now = new Date();
    for (const [depositId, deposit] of this.pendingDeposits) {
      const depositTime = new Date(deposit.date);
  
      // const elapsedHours = (now.getTime() - depositTime.getTime()) / (1000 * 60 * 60);
      // if (elapsedHours >= 24) {
      //   const cardId = deposit.operation.card.id;
      //   const amount = deposit.operation.amount;
      //   await this.addDepositOperation(cardId, amount);
      //   this.pendingDeposits.delete(depositId);
      // }

      // 1 minute
      const elapsedMinutes = (now.getTime() - depositTime.getTime()) / (1000 * 60);
      if (elapsedMinutes >= 1) { 
        const cardId = deposit.operation.card.id;
        const amount = deposit.operation.amount;
        await this.addDepositOperation(cardId, amount);
        this.pendingDeposits.delete(depositId);
      }
    }
  }

  private async addDepositOperation(cardId: number, amount: number): Promise<void> {
    const card = await this.cardRepository.findOne({ where: { id: cardId }, relations: ['account'] });
    if (!card) {
      throw new NotFoundException('Carte introuvable.');
    }

    const newOperation = this.operationRepository.create({
      card,
      dab: null, 
      amount,
      isWithdrawal: false,
      date: new Date(),
    });

    await this.operationRepository.save(newOperation);
    console.log(`Opération de dépôt de ${amount} ajoutée pour la carte ${card.cardNumber}.`);
  }
}

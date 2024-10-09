import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Operation } from './operation.entity';
import { Card } from '../cards/card.entity';
import * as moment from 'moment';

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
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

  async updateOperation(id: number, operationData: Partial<Operation>): Promise<Operation> {
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
      throw new BadRequestException('Une opération ne peut pas avoir à la fois un `amount` et un `transfer`.');
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
}

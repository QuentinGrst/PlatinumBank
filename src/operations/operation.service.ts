import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async createOperation(operationData: Partial<Operation>): Promise<Operation> {
    this.validateOperationData(operationData);

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

  // Méthode privée pour valider la cohérence des données de l'opération, Si `amount` est défini, `transfer` doit être nul etc.
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
}

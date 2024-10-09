import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './transfer.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
  ) {}

  async createTransfer(transferData: Partial<Transfer>): Promise<Transfer> {
    const transfer = this.transferRepository.create(transferData);
    return this.transferRepository.save(transfer);
  }

  async findAllTransfers(): Promise<Transfer[]> {
    return this.transferRepository.find();
  }

  async findTransferById(id: number): Promise<Transfer> {
    const transfer = await this.transferRepository.findOne({ where: { id } });
    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }
    return transfer;
  }

  async updateTransfer(
    id: number,
    transferData: Partial<Transfer>,
  ): Promise<Transfer> {
    const transfer = await this.findTransferById(id);
    Object.assign(transfer, transferData);
    return this.transferRepository.save(transfer);
  }

  async deleteTransfer(id: number): Promise<void> {
    const result = await this.transferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }
  }
}

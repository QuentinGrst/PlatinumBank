import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { Transfer } from './transfer.entity';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async createTransfer(
    @Body() transferData: Partial<Transfer>,
  ): Promise<Transfer> {
    return this.transferService.createTransfer(transferData);
  }

  @Get()
  async findAllTransfers(): Promise<Transfer[]> {
    return this.transferService.findAllTransfers();
  }

  @Get(':id')
  async findTransferById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transfer> {
    return this.transferService.findTransferById(id);
  }

  @Put(':id')
  async updateTransfer(
    @Param('id', ParseIntPipe) id: number,
    @Body() transferData: Partial<Transfer>,
  ): Promise<Transfer> {
    return this.transferService.updateTransfer(id, transferData);
  }

  @Delete(':id')
  async deleteTransfer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transferService.deleteTransfer(id);
  }
}

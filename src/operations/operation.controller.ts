import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OperationService } from './operation.service';
import { Operation } from './operation.entity';

@Controller('operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  async createOperation(@Body() operationData: Partial<Operation>): Promise<Operation> {
    return this.operationService.createOperation(operationData);
  }

  @Get()
  async findAllOperations(): Promise<Operation[]> {
    return this.operationService.findAllOperations();
  }

  @Get(':id')
  async findOperationById(@Param('id', ParseIntPipe) id: number): Promise<Operation> {
    return this.operationService.findOperationById(id);
  }

  @Put(':id')
  async updateOperation(
    @Param('id', ParseIntPipe) id: number,
    @Body() operationData: Partial<Operation>,
  ): Promise<Operation> {
    return this.operationService.updateOperation(id, operationData);
  }

  @Delete(':id')
  async deleteOperation(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.operationService.deleteOperation(id);
  }
}

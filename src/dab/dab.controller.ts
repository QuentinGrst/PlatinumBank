import { Controller, Get, Param } from '@nestjs/common';
import { DabService } from './dab.service';
import { Dab } from './entities/dab.entity';

@Controller('dab')
export class DabController {
  constructor(private dabService: DabService) {}

  @Get()
  async findBy(@Param('id') id: number): Promise<Dab> {
    return await this.dabService.findById(id);
  }

  @Get()
  async connectUser(): Promise<Dab[]> {
    return await this.dabService.connectUser('', 1234);
  }
}

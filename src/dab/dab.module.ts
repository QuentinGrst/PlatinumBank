import { Module } from '@nestjs/common';
import { DabService } from './dab.service';
import { DabController } from './dab.controller';

@Module({
  controllers: [DabController],
  providers: [DabService],
})
export class DabModule {}

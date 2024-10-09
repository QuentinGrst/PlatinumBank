import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from './card.entity';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  async getAllCards(): Promise<Card[]> {
    return this.cardService.findAll();
  }

  @Get(':id')
  async getCardById(@Param('id', ParseIntPipe) id: number): Promise<Card> {
    const card = await this.cardService.findById(id);
    if (!card) {
      throw new NotFoundException(`La carte avec l'ID ${id} n'a pas été trouvée.`);
    }
    return card;
  }

  @Post()
  async createCard(@Body() cardData: Partial<Card>): Promise<Card> {
    return this.cardService.createCard(cardData);
  }

  @Put(':id')
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body() cardData: Partial<Card>,
  ): Promise<Card> {
    return this.cardService.updateCard(id, cardData);
  }

  @Delete(':id')
  async deleteCard(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardService.deleteCard(id);
  }
}
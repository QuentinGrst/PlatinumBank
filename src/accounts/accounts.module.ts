import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { User } from '../users/user.entity'; // Importer User
import { UsersModule } from '../users/users.module'; // Importer UsersModule
import { Card } from '../cards/card.entity';
import { CardModule } from '../cards/card.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Card]), // Inclure Account, User, Card ici
    UsersModule, // Importer UsersModule pour rendre UserRepository disponible
    CardModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}

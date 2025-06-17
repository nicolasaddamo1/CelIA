import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/Entity/transaction.enetity';
import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), TransactionsModule,
    UsersModule],
  providers: [AiService, TransactionsService, UsersService],
  controllers: [AiController],
})
export class AiModule { }

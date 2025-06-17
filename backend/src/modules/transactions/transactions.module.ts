import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/Entity/transaction.enetity';
import { UsersService } from '../users/users.service';
import { User } from 'src/Entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService, UsersService],
  exports: [TypeOrmModule]

})
export class TransactionsModule { }

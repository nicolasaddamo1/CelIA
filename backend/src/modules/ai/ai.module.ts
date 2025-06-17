import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule { }

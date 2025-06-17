import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Repository } from 'typeorm';
import { Transaction } from 'src/Entity/transaction.enetity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        @InjectRepository(Transaction)

        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('analyze')
    async analyze(@Body('userId') userId: string) {
        return this.aiService.analyzeTransactions(userId);

    }
}
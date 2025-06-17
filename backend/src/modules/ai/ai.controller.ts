import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { TransactionsService } from 'src/modules/transactions/transactions.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly transactionsService: TransactionsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('analyze')
    async analyze(@Req() req) {
        const userId = req.user.userId;
        const transactions = await this.transactionsService.findAllByUser(userId);
        return this.aiService.analyzeTransactions(transactions);
    }
}
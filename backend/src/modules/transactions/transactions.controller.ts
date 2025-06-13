import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Body() dto: CreateTransactionsDto, @Req() req: any) {
        const userId = req.user?.userId;
        return this.transactionsService.create(userId, dto);
    }

    @Get()
    async findAll(@Req() req: any) {
        const userId = req.user?.userId;
        return this.transactionsService.findAllByUser(userId);
    }
}

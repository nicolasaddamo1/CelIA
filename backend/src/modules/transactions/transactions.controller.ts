import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    email: string;
}
@UseGuards(JwtAuthGuard)

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Body() dto: CreateTransactionsDto, @Request() req) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) throw new Error('Authorization header missing');

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwtDecode<JwtPayload>(token);

        const userId = decoded.sub;

        console.log("userId", userId)
        return this.transactionsService.create(userId, dto);
    }

    @Get()
    async findAll(@Req() req: any) {
        const userId = req.user?.userId;
        return this.transactionsService.findAllByUser(userId);
    }
}

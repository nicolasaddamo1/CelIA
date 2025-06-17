import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateTransactionsDto } from './dto/transactions.dto';
import { User } from 'src/Entity/user.entity';
import { Transaction } from 'src/Entity/transaction.enetity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        private readonly usersService: UsersService,
    ) { }

    async create(userId: string, dto: CreateTransactionsDto) {
        const user = await this.usersService.getUsersById(userId);
        if (!user) throw new Error('User not found');

        const transaction = this.transactionRepo.create({
            ...dto,
            user: user as User
        });

        return await this.transactionRepo.save(transaction);
    }

    async findAllByUser(userId: string) {
        console

        const result = await this.transactionRepo.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
        });
        console.log(result);
        return result;
    }
}



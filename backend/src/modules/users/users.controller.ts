import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
    @Get(':id')
    async getUsersById(@Param('id') id: string) {
        return await this.usersService.getUsersById(id);
    }
}

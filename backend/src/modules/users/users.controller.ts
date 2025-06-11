import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/users.dto';
import { User } from 'src/Entity/user.entity';

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

    @Post()
    async createUser(@Body() user: createUserDto): Promise<Partial<User> | string> {
        return await this.usersService.createUser(user);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: User): Promise<Partial<User> | string> {
        return await this.usersService.updateUser(id, user);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }

}

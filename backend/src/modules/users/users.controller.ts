import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/users.dto';
import { User } from 'src/Entity/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUsersById(@Param('id') id: string) {
        return await this.usersService.getUsersById(id);
    }

    @Post()
    async createUser(@Body() user: createUserDto): Promise<Partial<User> | string> {
        return await this.usersService.createUser(user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() user: User): Promise<Partial<User> | string> {
        return await this.usersService.updateUser(id, user);
    }
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async budget(@Param('id') id: string, @Body() user: User): Promise<Partial<User> | string> {
        if (!user.budget) {
            return 'El presupuesto no puede ser nulo';
        }
        return await this.usersService.updateUser(id, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }

}

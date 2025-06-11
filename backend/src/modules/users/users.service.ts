import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDto, UpdateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
    async getUsersById(id: string): Promise<string | User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            return "User not found";
        }
        return user;
    }
    async createUser(user: createUserDto): Promise<Omit<User, "password"> | Partial<User> | string> {
        //Verify if email already exists
        const emailExists = await this.userRepository.findOneBy({ email: user.email });
        if (emailExists) {
            return "Email already exists";
        }
        //Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        user.password = hashedPassword;

        //Save and create user
        const newUser = this.userRepository.create(user);
        const added = await this.userRepository.save(newUser);
        const { password, ...userWithoutPassword } = added;

        return userWithoutPassword
    }
    async updateUser(id: string, user: UpdateUserDto): Promise<Partial<User> | string> {
        const userToUpdate = await this.userRepository.findOneBy({ id });
        if (!userToUpdate) {
            return "User not found";
        }
        const updatedUser = Object.assign(userToUpdate, user);
        return await this.userRepository.save(updatedUser);
    }

    async deleteUser(id: string): Promise<string> {
        const userToDelete = await this.userRepository.findOneBy({ id });
        if (!userToDelete) {
            return "User not found";
        }
        await this.userRepository.remove(userToDelete);
        return "User deleted";
    }
}

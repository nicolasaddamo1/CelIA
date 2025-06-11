import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    async getAllUsers() {
        return this.userRepository.find();
    }
    async getUsersById(id: string): Promise<string | User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            return "User not found";
        }
        return user;
    }
    async createUser(user: createUserDto): Promise<Partial<User>> {

        const newUser = this.userRepository.create(user);
        const added = await this.userRepository.save(newUser);

        const { password, ...result } = added;

        return added
    }
}

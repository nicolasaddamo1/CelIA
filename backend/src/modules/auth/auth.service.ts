import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ) { }
    async signin(dto: LoginDto) {
        const user = await this.userService.findByEmailWithPassword(dto.email);

        if (typeof user === 'string') {
            return user;
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.signToken(user.id, user.email);
    }

    private signToken(userId: string, email: string) {
        const payload = { sub: userId, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

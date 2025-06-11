import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @MinLength(6)
    password: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

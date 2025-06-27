import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transaction } from "src/Entity/transaction.enetity";

export class createUserDto {

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    telegramId?: string;

    @IsOptional()
    transactions?: Transaction[];

    @IsOptional()
    budget?: number;

}

export class UpdateUserDto extends PartialType(createUserDto) { } 
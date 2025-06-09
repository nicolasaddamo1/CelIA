import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transaction } from "src/Entity/transaction.enetity";

export class createUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    transactions?: Transaction[];
}
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/Entity/category.entity";
import { User } from "src/Entity/user.entity";

export class CreateTransactionsDto {
    @IsNotEmpty()
    @IsString()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    category: Category;

    @IsNotEmpty()
    user: User
}

export class UpdateTransactionDto extends PartialType(CreateTransactionsDto) { }
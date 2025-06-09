import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/Entity/category.entity";
import { User } from "src/Entity/user.entity";

export class TransactionsDto {
    @IsString()
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    user: User;

    @IsNotEmpty()
    category: Category;
}
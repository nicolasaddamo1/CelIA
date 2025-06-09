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

    @IsOptional()
    transactions?: Transaction[];
}

export class UpdateUserDto extends PartialType(createUserDto) { } 
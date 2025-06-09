import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    transactionts?: string[]
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

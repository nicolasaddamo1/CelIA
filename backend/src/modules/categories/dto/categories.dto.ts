import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    transactionts?: string[]
}


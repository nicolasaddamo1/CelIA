import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateDateColumn } from "typeorm";

export class CreateImportFilesDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @CreateDateColumn()
    uploadDate: Date;

    @IsString()
    @IsNotEmpty()
    user: string;
}

export class UpdateImportFilesDto extends PartialType(CreateImportFilesDto) { }
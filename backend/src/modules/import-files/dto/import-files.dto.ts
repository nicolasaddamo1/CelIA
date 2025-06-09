import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class ImportFilesDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    uploadDate: Date;

    @IsString()
    @IsNotEmpty()
    user: string;
}

export class UpdateImportFilesDto extends PartialType(ImportFilesDto) { }
import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateImportFilesDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;
}

export class UpdateImportFilesDto extends PartialType(CreateImportFilesDto) { }
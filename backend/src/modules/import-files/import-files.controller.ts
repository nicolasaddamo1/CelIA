import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImportFilesService } from './import-files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateImportFilesDto } from './dto/import-files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@UseGuards(JwtAuthGuard)
@Controller('import-files')
export class ImportFilesController {
    constructor(private readonly importFilesService: ImportFilesService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = path.join(__dirname, '../../../uploads');
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = `${Date.now()}-${file.originalname}`;
                    cb(null, uniqueName);
                },
            }),
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        return this.importFilesService.create(
            { fileName: file.filename },
            req.user,
        );
    }

    @Post()
    create(@Body() dto: CreateImportFilesDto, @Request() req) {
        return this.importFilesService.create(dto, req.user);
    }

    @Get()
    findAll(@Request() req) {
        return this.importFilesService.findAllByUser(req.user.userId);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() req) {
        return this.importFilesService.delete(Number(id), req.user.userId);
    }
}

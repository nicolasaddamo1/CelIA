import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ImportFilesService } from './import-files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateImportFilesDto } from './dto/import-files.dto';

@UseGuards(JwtAuthGuard)
@Controller('import-files')
export class ImportFilesController {
    constructor(private readonly importFilesService: ImportFilesService) { }

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

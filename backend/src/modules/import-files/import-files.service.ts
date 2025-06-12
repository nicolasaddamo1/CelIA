import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportFile } from 'src/Entity/importFile.entity';
import { User } from 'src/Entity/user.entity';
import { CreateImportFilesDto } from './dto/import-files.dto';
import * as csv from 'fast-csv';
import { UsersService } from '../users/users.service';

@Injectable()
export class ImportFilesService {

    constructor(
        @InjectRepository(ImportFile)
        private importFileRepo: Repository<ImportFile>,
        private userService: UsersService
    ) { }

    async parseCSV(file: Express.Multer.File) {
        const transactions: Record<string, any>[] = [];
        return new Promise((resolve, reject) => {
            csv.parseString(file.buffer.toString(), { headers: true })
                .on('data', (row) => transactions.push(row))
                .on('end', () => resolve(transactions))
                .on('error', reject);
        });
    }

    async create(dto: CreateImportFilesDto, userJwtPayload: { userId: string }) {
        const user = await this.userService.getUsersById(userJwtPayload.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const file = this.importFileRepo.create({
            fileName: dto.fileName,
            uploadDate: new Date(),
            user: user as User,
        });
        const result = await this.importFileRepo.save(file);
        return result;
    }

    async findAllByUser(userId: string) {
        return this.importFileRepo.find({
            where: { user: { id: userId } },
            order: { uploadDate: 'DESC' },
        });
    }

    async delete(id: number, userId: string) {
        const result = await this.importFileRepo.delete({ id, user: { id: userId } });
        if (!result.affected) {
            throw new Error('File not found');
        }
        return result.affected > 0;
    }
}

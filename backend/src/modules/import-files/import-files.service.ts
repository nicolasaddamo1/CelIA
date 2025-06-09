import { Injectable } from '@nestjs/common';
import * as csv from 'fast-csv';

@Injectable()
export class ImportFilesService {

    constructor() { }

    async parseCSV(file: Express.Multer.File) {
        const transactions: Record<string, any>[] = [];
        return new Promise((resolve, reject) => {
            csv.parseString(file.buffer.toString(), { headers: true })
                .on('data', (row) => transactions.push(row))
                .on('end', () => resolve(transactions))
                .on('error', reject);
        });
    }

}

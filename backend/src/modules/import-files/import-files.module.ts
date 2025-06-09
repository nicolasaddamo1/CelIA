import { Module } from '@nestjs/common';
import { ImportFilesController } from './import-files.controller';
import { ImportFilesService } from './import-files.service';

@Module({
  controllers: [ImportFilesController],
  providers: [ImportFilesService]
})
export class ImportFilesModule {}

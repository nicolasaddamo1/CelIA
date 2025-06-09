import { Module } from '@nestjs/common';
import { ImportFilesController } from './import-files.controller';

@Module({
  controllers: [ImportFilesController]
})
export class ImportFilesModule {}

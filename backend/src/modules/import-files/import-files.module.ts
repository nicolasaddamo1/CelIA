import { Module } from '@nestjs/common';
import { ImportFilesController } from './import-files.controller';
import { ImportFilesService } from './import-files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportFile } from 'src/Entity/importFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImportFile])],
  controllers: [ImportFilesController],
  providers: [ImportFilesService]
})
export class ImportFilesModule { }

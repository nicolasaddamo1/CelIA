import { Module } from '@nestjs/common';
import { ImportFilesController } from './import-files.controller';
import { ImportFilesService } from './import-files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportFile } from 'src/Entity/importFile.entity';
import { User } from 'src/Entity/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImportFile, User])],
  controllers: [ImportFilesController],
  providers: [ImportFilesService, UsersService]
})
export class ImportFilesModule { }

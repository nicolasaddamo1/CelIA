import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ImportFilesModule } from './modules/import-files/import-files.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { Category } from './Entity/category.entity';
import { User } from './Entity/user.entity';
import { Transaction } from './Entity/transaction.enetity';
import { ImportFile } from './Entity/importFile.entity';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './ai/ai.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Category, User, Transaction, ImportFile],
      synchronize: true,
    }),
    AuthModule,
    AiModule,
    UsersModule,
    TransactionsModule,
    ImportFilesModule,
    CategoriesModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.enetity";
import { ImportFile } from "./importFile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    telegramId: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

    @OneToMany(() => ImportFile, file => file.user)
    files: ImportFile[];
}

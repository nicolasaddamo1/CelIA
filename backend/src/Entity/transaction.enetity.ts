import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.transactions)
    user: User;

    @ManyToOne(() => Category, category => category.transactions)
    category: Category;
}

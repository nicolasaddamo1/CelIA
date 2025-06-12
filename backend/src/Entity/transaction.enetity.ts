import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => User, user => user.transactions)
    user: User;

    @ManyToOne(() => Category, category => category.transactions)
    category: Category;
}

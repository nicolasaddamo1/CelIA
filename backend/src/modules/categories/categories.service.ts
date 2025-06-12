import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/Entity/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }

    async findAll() {
        return this.categoryRepo.find();
    }

    async findOne(id: number) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async create(dto: CreateCategoryDto) {
        const category = this.categoryRepo.create(dto);
        return this.categoryRepo.save(category);
    }

    async update(id: number, dto: UpdateCategoryDto) {
        await this.findOne(id);
        await this.categoryRepo.update(id, dto);
        return this.findOne(id);
    }

    async delete(id: number) {
        const result = await this.categoryRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Categoría no encontrada');
        }
    }
}

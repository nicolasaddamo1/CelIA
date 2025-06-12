import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.categoriesService.findOne(Number(id));
    }

    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        return await this.categoriesService.create(dto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return await this.categoriesService.update(Number(id), dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.categoriesService.delete(Number(id));
    }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { Category } from 'src/Entity/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
        return await this.categoriesService.findOne(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateCategoryDto): Promise<Category | string> {
        return await this.categoriesService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return await this.categoriesService.update(Number(id), dto);
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return await this.categoriesService.delete(Number(id));
    }
}

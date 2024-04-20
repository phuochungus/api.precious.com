import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { StorageService } from '../firebase/storage.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let { id } = await this.categoryRepository.save({ ...createCategoryDto });
    return id;
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }


  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    let category = this.categoryRepository.findOne({ where: { id } });
    return await this.categoryRepository.save({ ...category, ...updateCategoryDto });
  }

  async remove(id: number) {
    return await this.categoryRepository.softDelete({ id });
  }
}

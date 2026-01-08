import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  create(data: any) {
    const category = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: number, data: any) {
    await this.categoriesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if(category) {
       return this.categoriesRepository.remove(category);
    }
    return null;
  }
}

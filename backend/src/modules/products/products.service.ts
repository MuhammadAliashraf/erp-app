import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: any) {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({
        order: {
            createdAt: 'DESC',
        }
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProductDto: any) {
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if(product) {
       return this.productsRepository.remove(product);
    }
    return null;
  }
}

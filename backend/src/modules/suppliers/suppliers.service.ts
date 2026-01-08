import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  create(data: any) {
    const supplier = this.suppliersRepository.create(data);
    return this.suppliersRepository.save(supplier);
  }

  findAll() {
    return this.suppliersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.suppliersRepository.findOne({ where: { id } });
  }

  async update(id: number, data: any) {
    await this.suppliersRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
     const supplier = await this.findOne(id);
    if(supplier) {
       return this.suppliersRepository.remove(supplier);
    }
    return null;
  }
}

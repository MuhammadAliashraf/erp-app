import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Grn } from './entities/grn.entity';
import { GrnItem } from './entities/grn-item.entity';
import { CreateGrnDto } from './dto/create-grn.dto';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class GrnService {
  constructor(
    @InjectRepository(Grn)
    private grnRepository: Repository<Grn>,
    @InjectRepository(PurchaseOrder)
    private poRepository: Repository<PurchaseOrder>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createGrnDto: CreateGrnDto): Promise<Grn> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const po = await this.poRepository.findOne({ where: { id: createGrnDto.purchaseOrderId } });
      if (!po) {
        throw new NotFoundException(`Purchase Order #${createGrnDto.purchaseOrderId} not found`);
      }

      // Generate GRN Number (Simple logic: GRN-TIMESTAMP)
      const grnNumber = `GRN-${Date.now()}`;

      const grn = new Grn();
      grn.grnNumber = grnNumber;
      grn.purchaseOrderId = createGrnDto.purchaseOrderId;
      grn.supplierId = createGrnDto.supplierId;
      grn.receivedDate = new Date(createGrnDto.receivedDate);
      grn.notes = createGrnDto.notes;
      grn.status = 'Posted'; // Auto-post for now

      // Calculate total value
      let totalValue = 0;
      grn.items = [];

      for (const itemDto of createGrnDto.items) {
        const item = new GrnItem();
        item.productId = itemDto.productId;
        item.receivedQuantity = itemDto.receivedQuantity;
        item.unitPrice = itemDto.unitPrice;
        item.totalPrice = itemDto.receivedQuantity * itemDto.unitPrice;
        
        totalValue += item.totalPrice;
        grn.items.push(item);

        // Update Inventory
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (product) {
          product.stockQuantity += item.receivedQuantity;
          await queryRunner.manager.save(Product, product);
        }
      }

      grn.totalValue = totalValue;

      const savedGrn = await queryRunner.manager.save(Grn, grn);

      // Update PO Status
      po.status = 'Received';
      await queryRunner.manager.save(PurchaseOrder, po);

      await queryRunner.commitTransaction();
      return savedGrn;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Grn[]> {
    return this.grnRepository.find({
      relations: ['supplier', 'purchaseOrder'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Grn> {
    const grn = await this.grnRepository.findOne({
      where: { id },
      relations: ['supplier', 'purchaseOrder', 'items', 'items.product'],
    });

    if (!grn) {
      throw new NotFoundException(`GRN #${id} not found`);
    }

    return grn;
  }
}

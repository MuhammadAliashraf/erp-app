import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async create(data: any) {
    // Generate Order Number if not provided
    if (!data.orderNumber) {
        const count = await this.purchaseOrderRepository.count();
        const date = new Date();
        const year = date.getFullYear();
        data.orderNumber = `PO-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }

    // Calculate item totals and grand total
    let totalAmount = 0;
    if (data.items && Array.isArray(data.items)) {
        data.items = data.items.map(item => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const totalPrice = quantity * unitPrice;
            totalAmount += totalPrice;
            return {
                ...item,
                quantity,
                unitPrice,
                totalPrice
            };
        });
    }
    data.totalAmount = totalAmount;

    const purchaseOrder = this.purchaseOrderRepository.create(data);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  findAll() {
    return this.purchaseOrderRepository.find({
      relations: ['supplier', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['supplier', 'items', 'items.product'],
    });
  }

  async update(id: number, data: any) {
    const order = await this.findOne(id);
    if (!order) return null;

    // If items are being updated, we need to recalculate totals and replace items
    if (data.items && Array.isArray(data.items)) {
      // 1. Remove existing items
      // We assume full replacement of items list for simplicity
      await this.purchaseOrderRepository.manager.transaction(async transactionalEntityManager => {
        // Delete old items
        await transactionalEntityManager.delete(PurchaseOrderItem, { purchaseOrder: { id } });
        
        // Calculate new totals
        let totalAmount = 0;
        data.items = data.items.map(item => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const totalPrice = quantity * unitPrice;
            totalAmount += totalPrice;
            return {
                ...item,
                quantity,
                unitPrice,
                totalPrice
            };
        });
        
        data.totalAmount = totalAmount;

        // Update the order with new data and items
        // We need to merge carefully or just save the new state
        // Since we deleted items, we can assign the new items list
        
        // Assign new properties to the order object
        const updatedOrder = transactionalEntityManager.merge(PurchaseOrder, order, data);
        // Ensure items are treated as new
        updatedOrder.items = data.items;
        
        await transactionalEntityManager.save(updatedOrder);
      });
      
      return this.findOne(id);
    } else {
        // Just update header info (like status)
        await this.purchaseOrderRepository.update(id, data);
        return this.findOne(id);
    }
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if(order) {
        return this.purchaseOrderRepository.remove(order);
    }
    return null;
  }
}

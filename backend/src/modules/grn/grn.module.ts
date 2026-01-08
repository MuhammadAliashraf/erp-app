import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrnService } from './grn.service';
import { GrnController } from './grn.controller';
import { Grn } from './entities/grn.entity';
import { GrnItem } from './entities/grn-item.entity';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grn, GrnItem, PurchaseOrder, Product])],
  controllers: [GrnController],
  providers: [GrnService],
})
export class GrnModule {}

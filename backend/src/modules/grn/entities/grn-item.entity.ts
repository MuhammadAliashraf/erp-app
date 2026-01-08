import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Grn } from './grn.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class GrnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grnId: number;

  @ManyToOne(() => Grn, (grn) => grn.items, { onDelete: 'CASCADE' })
  grn: Grn;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'int' })
  receivedQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
}

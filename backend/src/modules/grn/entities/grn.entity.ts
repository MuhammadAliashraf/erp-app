import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { GrnItem } from './grn-item.entity';

@Entity()
export class Grn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  grnNumber: string;

  @Column()
  purchaseOrderId: number;

  @ManyToOne(() => PurchaseOrder)
  purchaseOrder: PurchaseOrder;

  @Column({ nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier)
  supplier: Supplier;

  @OneToMany(() => GrnItem, (item) => item.grn, { cascade: true })
  items: GrnItem[];

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({ default: 'Draft' })
  status: string; // Draft, Posted

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

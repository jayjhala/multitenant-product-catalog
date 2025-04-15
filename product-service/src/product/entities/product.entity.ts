import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product') // You can specify 'product' schema if needed later
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenant_id: string; // Associate with tenant

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column({ nullable: true })
  description?: string;
}

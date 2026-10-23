import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_has_products')
export class OrderHasProducts {

    @PrimaryColumn()
    id_order: number;
    
    @PrimaryColumn()
    id_product: number;

    @Column()
    quantity: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Order, (order) => order.orderHasProducts)
    @JoinColumn({ name: 'id_order' })
    order: Order

    @ManyToOne(() => Product, (product) => product.orderHasProducts)
    @JoinColumn({ name: 'id_product' })
    product: Product

}

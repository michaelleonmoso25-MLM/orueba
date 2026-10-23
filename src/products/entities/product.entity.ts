import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OrderHasProducts } from '../../orders/dto/order_has_products.entity';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    description: string;

    @Column({ nullable: true })
    image1: string;
    
    @Column({ nullable: true })
    image2: string;
    
    @Column()
    id_category: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2 }) // permite precios con centavos (ej. 199.99)
    price: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({name: 'id_category'})
    category: Category

    @OneToMany(() => OrderHasProducts, (ohp) => ohp.product)
    orderHasProducts: OrderHasProducts[]


}

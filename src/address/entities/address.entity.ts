import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({name: 'address'})
export class Address {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    address: string;
    
    @Column()
    neighborhood: string;

    @Column()
    id_user: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // TODO: agregar la relación con Order cuando Order sea una entidad (@Entity)
    // @OneToMany(() => Order, (order) => order.address)
    // orders: Order[];

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    user: User;

}

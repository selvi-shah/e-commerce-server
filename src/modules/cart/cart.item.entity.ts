import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Cart } from './cart.entity';


@Entity('cart-items')
export class CartItems {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'int'})
    quantity!: number;

    @ManyToOne(() => Product, {eager: true})
    Product!: Product;

    @ManyToOne(() => Cart)
    Cart!: Cart;

}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.entity";
import { Order } from "./order.entity";


@Entity('order-items')
export class OrderItems {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'int'})
    quantity!: number;

    @ManyToOne(() => Product, {eager: true})
    Product!: Product;

    @ManyToOne(() => Order)
    Order!: Order;
}
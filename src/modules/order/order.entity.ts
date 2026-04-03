import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { OrderItems } from "./order.item.entity";
import { OrderStatus } from "../../types/order-status.type";
import { PaymentStatus } from "../../types/payment-status.type";


@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { eager: true})
    User!: User;

    @OneToMany(() => OrderItems, (OrderItems) => OrderItems.Order, {eager: true})
    OrderItems!: OrderItems[];

    @Column('decimal')
    totalPrice!: number;

    @Column('varchar')
    status!: OrderStatus

    @Column('varchar', {default: 'unpaid'})
    paymentStatus!: PaymentStatus
}
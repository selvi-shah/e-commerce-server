import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from '../auth/user.entity';
import { CartItems } from "./cart.item.entity";


@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, { eager: true})
    @JoinColumn()
    User!: User;

    @OneToMany(() => CartItems, (CartItems) => CartItems.Cart, {eager: true} )
    CartItems!: CartItems[];
}

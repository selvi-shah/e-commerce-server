import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../modules/auth/user.entity';
import { Product } from '../modules/product/product.entity';


@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text' })
  comment!: string;

  @CreateDateColumn()
  date!: Date;

  @ManyToOne(() => User, { eager: true })
  User!: User;

  @ManyToOne(() => Product, { eager: true })
  Product!: Product;
}
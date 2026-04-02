import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './modules/auth/user.entity';
import { Product } from './modules/product/product.entity';
import { Review } from './review/review.entity';
import { Cart } from './modules/cart/cart.entity';
import { CartItems } from './modules/cart/cart.item.entity';

const developmentConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  entities: [User, Product, Review, Cart, CartItems],
  migrations: ['src/migration/**/*.ts'],
  synchronize: true,
  logging: false
};

const productionConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  entities: [User, Product, Review, Cart, CartItems],
  synchronize: false
};

const options = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

export const AppDataSource = new DataSource(options);
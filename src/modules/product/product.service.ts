import { DeleteResult, IsNull } from 'typeorm';
import { UpdateResult } from 'typeorm';
import { AppDataSource } from '../../ormconfig';

import { Product } from './product.entity';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductNotFoundException } from '../../exceptions/ProductNotFoundException';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  addProduct = async (addProductDTO: AddProductDTO): Promise<Product> => {
    const newProduct = this.productRepository.create({
      ...addProductDTO
    });

    return this.productRepository.save(newProduct);
  };

  deleteProduct = async (id: string): Promise<DeleteResult> => {
    const result = await this.productRepository.delete({ id });

    if (result.affected === 0) {
      throw new ProductNotFoundException(id);
    }

    return result;
  };

  softDeleteProduct = async (id: string): Promise<UpdateResult> => {
    const result = await this.productRepository.update({ id }, { deletedAt: new Date() });

    return result;
  }

  getProduct = async (id: string): Promise<Product> => {
    const product = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  };

  getProductsByType = async (type: string, page: number, limit: number): Promise<[Product[], number]> => {
    if (type === 'all') {
      return this.productRepository.findAndCount({where: { deletedAt: IsNull()}, skip: (page - 1) * limit, take: limit});
    }

    return this.productRepository.findAndCount({
      where: { type: type as any, deletedAt: IsNull() }, skip: (page - 1) * limit, take: limit
    });
  };

  getProductsByQuery = async (query: string): Promise<Product[]> => {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.name ilike :name', { name: `%${query}%` })
      .getMany();
  };
}

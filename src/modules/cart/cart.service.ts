
import { AppDataSource } from "../../ormconfig";
import { Cart } from "./cart.entity";
import { CartItems } from "./cart.item.entity";
import { AddProductInCartDTO } from "./dto/cart.dto";
import { HttpException } from "../../exceptions/HttpException";
import { DeleteResult } from "typeorm";
import { ProductNotFoundException } from "../../exceptions/ProductNotFoundException";


export class CartService {
    private cartRepository = AppDataSource.getRepository(Cart);
    private cartItemsRepository = AppDataSource.getRepository(CartItems);

    addProduct = async (addProductInCartDTO: AddProductInCartDTO, userId: string): Promise<Cart> => {
        let cart = await this.cartRepository.findOne({ 
            where: { User: {id: userId }}
        });

        if(!cart) {
            const newCart = this.cartRepository.create({User: { id: userId} as any});

            cart = await this.cartRepository.save(newCart);
        }


        const productExisting = await this.cartItemsRepository.findOne({
            where: {
                Cart: { id: cart!.id },
                Product: { id: addProductInCartDTO.productId }
            }
        });


        if(!productExisting) {
            const newCartItem = this.cartItemsRepository.create({ 
                Cart: cart,
                Product: {id: addProductInCartDTO.productId},
                quantity: addProductInCartDTO.quantity
            });
            
             await this.cartItemsRepository.save(newCartItem)
        } else {
            await this.cartItemsRepository.update(
                { id: productExisting.id },
                { quantity: productExisting.quantity + addProductInCartDTO.quantity }
            )
        }
        return cart!
    }

    getCart = async (id: string): Promise<Cart> => {
        const cart = await this.cartRepository.findOne({
            where: { User: { id }}
        });
        if(!cart) {
            throw new HttpException(404, "Cart not found")
        }
       return cart;
    }

    removeProduct = async (id: string): Promise<DeleteResult> => {
        const result = await this.cartItemsRepository.delete({ id });

        if(result.affected === 0) {
            throw new ProductNotFoundException(id);
        }

        return result;
    }
    
}
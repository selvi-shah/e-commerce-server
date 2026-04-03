import express, { Request, Response, NextFunction} from 'express';
import { Controller } from '../../types/controller.interface';
import { CartService } from './cart.service';
import { AddProductInCartDTO } from './dto/cart.dto';
import { authMiddleware } from '../../middlewares/auth.middleware';


export class CartController implements Controller {
    public path = '/cart';
    public router = express.Router();
    private cartService = new CartService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router
        .post(`${this.path}`, authMiddleware, this.addProduct)
        .get(`${this.path}`, authMiddleware, this.getCart)
        .delete(`${this.path}/:id`, authMiddleware, this.removeProduct)
    }

    private addProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const productData: AddProductInCartDTO = req.body;
        try {
            const newProduct = await this.cartService.addProduct(productData, req.user.id);
            res.status(200).json(newProduct);
        } catch (error) {
            console.log(error)
        }
    }

    private getCart = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
          const cart = await this.cartService.getCart(req.user.id);
          res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    private removeProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.cartService.removeProduct(id);
            res.status(200).json({ success: true });
        } catch (error) {
            next(error)
        }
    }
}
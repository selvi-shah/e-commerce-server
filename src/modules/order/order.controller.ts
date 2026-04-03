import express, { Request, Response, NextFunction} from 'express';
import { Controller } from "../../types/controller.interface";
import { authMiddleware } from '../../middlewares/auth.middleware';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/order.dto';
import { roleMiddleware } from '../../middlewares/roleMiddleware';


export class OrderController implements Controller {
    public path = '/order';
    public router = express.Router();
    private orderService = new OrderService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router
        .post(`${this.path}`, authMiddleware, this.newOrder)
        .patch(`${this.path}/:id`, authMiddleware, roleMiddleware, this.updateOrder)
        .patch(`${this.path}/return/:id`, authMiddleware, this.returnOrder)
    }

    private newOrder = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const orderData: CreateOrderDTO = req.body;

        try {
            const newProduct = await this.orderService.newOrder(orderData, req.user.id);
            res.status(200).json(newProduct);
        } catch (error) {
            next(error)
        }
    }

    updateOrder = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const{ status } = req.body;

           const updateOrder = await this.orderService.updateStatus(id, status );
            res.status(200).json(updateOrder)
        } catch (error) {
            next(error)
        }
    }

    returnOrder = async (
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const userId  = req.user.id;
            const returnOrder = await this.orderService.returnOrder(id, userId)
            res.status(200).json(returnOrder)
        } catch (error) {
            next(error)
        }
    }
}
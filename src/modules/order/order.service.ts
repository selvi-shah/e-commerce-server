import Razorpay from "razorpay";
import { HttpException } from "../../exceptions/HttpException";
import { AppDataSource } from "../../ormconfig";
import { OrderStatus } from "../../types/order-status.type";
import { Product } from "../product/product.entity";
import { CreateOrderDTO } from "./dto/order.dto";
import { Order } from "./order.entity";
import { OrderItems } from "./order.item.entity";
import { VerifyPaymentDTO } from "./dto/verify.payment.dto";
import crypto from 'crypto';


export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private orderItemsRepository = AppDataSource.getRepository(OrderItems);
    private productRepository = AppDataSource.getRepository(Product); 
    
    private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});
    
    newOrder = async (createOrderDTO: CreateOrderDTO, userId: string): Promise<Order> => {
        const product = await this.productRepository.findOne({
            where: { id: createOrderDTO.productId}
        });

        if(!product) {
            throw new HttpException(401, "Product not found")
        }
        let totalPrice = product?.price * createOrderDTO.quantity

        const newOrder = this.orderRepository.create({
        User: {id: userId} as any,
        totalPrice,
        status: 'pending'
    });

    const savedOrder = await this.orderRepository.save(newOrder)

     const newOrderItem = this.orderItemsRepository.create({
        Order: savedOrder,
        Product: product,
        quantity: createOrderDTO.quantity
    });

    await this.orderItemsRepository.save(newOrderItem);

    return savedOrder
     }

    updateStatus = async (id: string, status: OrderStatus): Promise<Order> => {
        const product = await this.orderRepository.findOne({
            where: { id }
        });

        if(!product) {
            throw new HttpException(403, "Order not found")
        }

        await this.orderRepository.update({ id }, { status });

        const updatedOrder = await this.orderRepository.findOne({
            where: { id }
        });

        return updatedOrder!;
    }

    returnOrder = async (id: string, userId: string): Promise<Order> => {
        const order = await this.orderRepository.findOne({
            where: { id }
        });

        if(!order) {
            throw new HttpException(404, "Order not found")
        }

        if(order.status !== 'delivered') {
            throw new HttpException(403, "Your Order is not delivered yet")
        }

        if(order.User.id !== userId){
            throw new HttpException(403, "This order doesn't belong to you")
        }

        await this.orderRepository.update({id}, { status: 'cancelled'});
        const updatedOrder = await this.orderRepository.findOne({ where: { id }})

        return updatedOrder!;
    }

    createPayment = async (id: string): Promise<any> => {
        const order = await this.orderRepository.findOne({
            where: {id}
        });

        if(!order) {
            throw new HttpException(404, 'Order not found')
        }

        const razorpayOrder = await this.razorpay.orders.create({
            amount: order!.totalPrice * 100,
            currency: 'INR',
            receipt: order!.id
        });

        return razorpayOrder;
    }

    verifyPayment = async (verifyPaymentDTO: VerifyPaymentDTO, orderId: string): Promise<any> => {
        const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(verifyPaymentDTO.razorpay_order_id + '|' + verifyPaymentDTO.razorpay_payment_id)
        .digest('hex');

        if(generatedSignature !== verifyPaymentDTO.razorpay_signature){
            throw new HttpException(401, 'Signature not matched')
    }
        await this.orderRepository.update(
            {id: orderId},
            { paymentStatus: 'paid'}
        );

        const updatedOrder = await this.orderRepository.findOne({ where: { id: orderId } });
        
        return updatedOrder;
    }

    
}
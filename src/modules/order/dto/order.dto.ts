import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateOrderDTO {
        @IsString()
        @IsNotEmpty()
        productId!: string;
    
        @IsNumber()
        @IsNotEmpty()
        quantity!: number;
}
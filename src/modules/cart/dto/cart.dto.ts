import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AddProductInCartDTO {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsNumber()
    @IsNotEmpty()
    quantity!: number;
}
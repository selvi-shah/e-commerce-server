import { IsString , IsNumber, IsNotEmpty} from "class-validator";

export class CreateReviewDTO {

    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsNotEmpty()
    @IsString()
    comment!: string;

    @IsString()
    @IsNotEmpty()
    productId!: string;
}
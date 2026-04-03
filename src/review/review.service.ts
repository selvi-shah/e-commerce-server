import { AppDataSource } from "../ormconfig";
import { CreateReviewDTO } from "./dto/create.review.dto";
import { Review } from "./review.entity";


export class ReviewService {
    private reviewRepository = AppDataSource.getRepository(Review);

    addReview = async (createReviewDTO: CreateReviewDTO, userId: string,): Promise<Review> => {
        const newReview = this.reviewRepository.create({
            ...createReviewDTO,
            User: { id: userId },
            Product: { id: createReviewDTO.productId }
        });

        return this.reviewRepository.save(newReview);
    };

getReviewsByProductId = async (id: string): Promise<Review[]> => {
    const result = await this.reviewRepository.find({ where: {Product: {id: id}}})
    return result;
    }

getReviewsByUserAndProduct = async (userid: string, productid: string): Promise<Review[]> => {
    const result = await this.reviewRepository.find
    ({ where: {
        User: { id: userid },
        Product: { id: productid }
    }})
    return result;
}
}

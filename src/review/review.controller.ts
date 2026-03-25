import { Controller } from "../types/controller.interface";
import express, { Request, Response, NextFunction} from 'express';
import { ReviewService } from "./review.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CreateReviewDTO } from "./dto/create.review.dto";
import { HttpException } from "../exceptions/HttpException";

export class ReviewController implements Controller {
    public path = '/review';
    public router= express.Router();
    private reviewService = new ReviewService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router
        .post(this.path, authMiddleware, this.addReview)
        .get(`${this.path}/:id`, this.getReviewsByProductId)
    };

    private addReview = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const reviewData: CreateReviewDTO = req.body;
        const userId = req.user.id;

        try {
            const newReview = await this.reviewService.addReview(reviewData, userId);
            res.status(200).json(newReview);
        } catch (error) {
            next(new HttpException(500, 'Error occurred while adding review'))
        }
    }

    private getReviewsByProductId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            const reviews = await this.reviewService.getReviewsByProductId(id)
            res.status(200).json(reviews);
        } catch (error) {
            next(error)
        }
    }

}
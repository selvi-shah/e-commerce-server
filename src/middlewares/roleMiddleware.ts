import { Response, Request, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';


export const roleMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if(req.user.role !== 'admin') {
        next(new HttpException(403, "You are not admin"));
        return;
    } 
    next();
}
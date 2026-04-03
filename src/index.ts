import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './ormconfig';


import { validateEnv } from './utils/validateEnv';
import { App } from './app';
import { User } from './modules/auth/user.entity';
import { AuthController } from './modules/auth/auth.controller';
import { ProductController } from './modules/product/product.controller';
import { ReviewController } from './review/review.controller';
import { CartController } from './modules/cart/cart.controller';
import { OrderController } from './modules/order/order.controller';



// expand Request interface with a new property: user: User
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

validateEnv();


(async (): Promise<any> => {
  try {
    const connection = await AppDataSource.initialize();
    // connection.runMigrations();

    console.log(`Is connected: ${connection.isConnected}`);
  } catch (err) {
    console.log('Error while connecting to the database', err);
    return err;
  }

  const app = new App([new AuthController(), new ProductController(), new ReviewController(), new CartController(), new OrderController()]);
  app.listen();
})();

// create test brunch for deployment
// git push heroku HEAD:master
// after deployment: add env variables
// heroku logs --tail -> debugging

/* Start conf
- npm init
- tsc --init // tsconfig.json
*/

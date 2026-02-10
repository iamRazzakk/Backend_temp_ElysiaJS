import { Elysia } from 'elysia';
import { userController } from '../modules/user/user.controller';
import { productController } from '../modules/product/product.controller';

// API Version 1 Router
export const v1Router = new Elysia({ prefix: '/api/v1' })
  .use(userController)
  .use(productController);

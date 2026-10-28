import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const cartRouter = express.Router();

cartRouter.post('/:productId', authMiddleware, addToCart);
cartRouter.get('/', authMiddleware, getCart);
cartRouter.put('/:productId', authMiddleware, updateQuantity);
cartRouter.delete('/:productId', authMiddleware, removeFromCart);

export default cartRouter;

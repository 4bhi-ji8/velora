import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const wishlistRouter = express.Router();


wishlistRouter.post('/:productId',authMiddleware, addToWishlist)
wishlistRouter.get('/',authMiddleware,getWishlist)
wishlistRouter.delete("/:productId",authMiddleware,removeFromWishlist)


export default wishlistRouter;
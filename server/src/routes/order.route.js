import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { adminConfirmation, cancelOrder, createOrder, getAllOrders, getOrderById, getOrders } from '../controllers/order.controller.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const orderRouter = express.Router();

orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/',authMiddleware,getOrders);
orderRouter.get('/admin/orders',authMiddleware,adminMiddleware,getAllOrders)
orderRouter.get('/:id',authMiddleware,getOrderById);
orderRouter.put('/admin/orders/:id/status',authMiddleware,adminMiddleware,adminConfirmation)
orderRouter.put('/:id/cancel',authMiddleware,cancelOrder)

export default orderRouter;
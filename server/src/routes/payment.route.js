import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createRazorpayOrder, verifypayment } from '../controllers/payment.controller.js';



const paymentRouter = express.Router();

paymentRouter.post('/create-order', authMiddleware , createRazorpayOrder )
paymentRouter.post('/verify', authMiddleware , verifypayment);

export default paymentRouter;
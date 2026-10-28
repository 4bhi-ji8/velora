import express from "express";
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import addressRouter from "./routes/address.route.js";
import paymentRouter from "./routes/payment.route.js";
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/payments', paymentRouter);

export default app;
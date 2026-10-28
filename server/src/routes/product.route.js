import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, updateProductStock } from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";


const productRouter = express.Router();

productRouter.post('/', authMiddleware, adminMiddleware, createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id',getProductById);
productRouter.put('/:id', authMiddleware, adminMiddleware, updateProduct);
productRouter.put('/:id/stock',authMiddleware,adminMiddleware,updateProductStock)
productRouter.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);


export default productRouter;
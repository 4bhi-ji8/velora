import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js';


const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, adminMiddleware, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id',getCategoryById);
categoryRouter.put('/:id',authMiddleware,adminMiddleware,updateCategory)
categoryRouter.delete('/:id',authMiddleware,adminMiddleware,deleteCategory)



export default categoryRouter;
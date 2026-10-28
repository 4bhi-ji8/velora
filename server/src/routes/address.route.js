import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createAddress, deleteAddress, getAddress, getAddressById, setDefaultAddress, updateAddress } from "../controllers/address.controller.js";


const addressRouter = express.Router();

addressRouter.post('/', authMiddleware, createAddress);
addressRouter.get('/', authMiddleware, getAddress);
addressRouter.get('/:id', authMiddleware, getAddressById);
addressRouter.put('/:id', authMiddleware, updateAddress);
addressRouter.delete('/:id', authMiddleware,deleteAddress);
addressRouter.put('/:id/default', authMiddleware, setDefaultAddress);

export default addressRouter;
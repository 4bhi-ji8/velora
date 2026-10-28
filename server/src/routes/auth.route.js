import express from "express";
import { getProfile, loginUser, logoutUser, registerUser, updatePassword, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware,getProfile)
router.post('/logout', logoutUser)
router.get('/admin-test', authMiddleware, adminMiddleware, (req,res) => {
    res.status(200).json({status: 'OK', message: "welocme Admin!"});
})
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

export default router;
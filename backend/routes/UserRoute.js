import express from "express";
import { refreshToken } from "../controller/AuthController.js";
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    verifyEmail
} from "../controller/userController.js";
import { verifyUser, verifyToken } from "../middleware/AuthUser.js";
import User from "../model/UserModel.js";

const router = express.Router(); 

// router.get('/user/verify-token', verifyToken);
router.get('/user/refresh-token', refreshToken);
router.get('/user/verify-email', verifyEmail);
router.get('/user' ,verifyToken, verifyUser, getUser);
router.get('/user/:id',verifyUser, getUserById);
router.post('/user', createUser);
router.patch('/user/:id',verifyUser, updateUser);
router.delete('/user/:id',verifyUser, deleteUser);

export default router;



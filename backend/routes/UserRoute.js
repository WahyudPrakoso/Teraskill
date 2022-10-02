import express from "express";
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    verifyEmail
} from "../controller/userController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import User from "../model/UserModel.js";

const router = express.Router(); 

router.get('/user/verify-email', verifyEmail);
router.get('/user' ,verifyUser, adminOnly, getUser);
router.get('/user/:id',verifyUser, adminOnly, getUserById);
router.post('/user', createUser);
router.patch('/user/:id',verifyUser, adminOnly, updateUser);
router.delete('/user/:id',verifyUser, adminOnly, deleteUser);

export default router;



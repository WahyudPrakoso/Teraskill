import express from "express";
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/userController.js";
import { verifyUser, adminOnly, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/user',verifyToken ,verifyUser, adminOnly, getUser);
router.get('/user/:id',verifyUser, adminOnly, getUserById);
router.post('/user',verifyUser, adminOnly, createUser);
router.patch('/user/:id',verifyUser, adminOnly, updateUser);
router.delete('/user/:id',verifyUser, adminOnly, deleteUser);

export default router;



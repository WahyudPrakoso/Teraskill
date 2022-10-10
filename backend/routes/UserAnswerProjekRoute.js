import express from "express";
import {
    getUserAnswerProjek,
    getUserAnswerProjekById,
    createUserAnswerProjek,
    deleteUserAnswerProjek,
    updateUserAnswerProjek,
    uploadProjek
} from "../controller/userAnswerProjekController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/answer-projek',verifyUser, getUserAnswerProjek);
router.get('/answer-projek/:id',verifyUser,  getUserAnswerProjekById);
router.post('/answer-projek',verifyUser, uploadProjek,createUserAnswerProjek);
router.patch('/answer-projek/:id',verifyUser, uploadProjek, updateUserAnswerProjek);
router.delete('/answer-projek/:id',verifyUser,  deleteUserAnswerProjek);

export default router;



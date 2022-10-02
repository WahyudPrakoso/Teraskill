import express from "express";
import {
    getLearningPath,
    getLearningPathById,
    createLearningPath,
    editLearningPath,
    deleteLearningPath,
    uploadImage,
} from "../controller/learningPathController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/learning-path',verifyUser, getLearningPath);
router.get('/learning-path/:id',verifyUser,  getLearningPathById);
router.post('/learning-path',verifyUser, uploadImage, createLearningPath);
router.patch('/learning-path/:id',verifyUser,  editLearningPath);
router.delete('/learning-path/:id',verifyUser,  deleteLearningPath);

export default router;



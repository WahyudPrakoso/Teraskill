import express from "express";
import {
    getOptionExam,
    getOptionExamById,
    createOptionExam,
    deleteOptionExam,
    updateOptionExam,
    getOptionExamBySoalExamId
} from "../controller/optionExamController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/option-exam',verifyUser, getOptionExam);
router.get('/option-exam/:id',verifyUser,  getOptionExamById);
router.get('/option-exam/soal/:id',verifyUser,  getOptionExamBySoalExamId);
router.post('/option-exam',verifyUser, createOptionExam);
router.patch('/option-exam/:id',verifyUser, updateOptionExam);
router.delete('/option-exam/:id',verifyUser,  deleteOptionExam);

export default router;



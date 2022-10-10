import express from "express";
import {
    getSoalExam,
    getSoalExamById,
    createSoalExam,
    deleteSoalExam,
    updateSoalExam,
    getSoalExamByKelasId
} from "../controller/soalExamController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/soal-exam',verifyUser, getSoalExam);
router.get('/soal-exam/:id',verifyUser,  getSoalExamById);
router.get('/soal-exam/kelas/:id',verifyUser,  getSoalExamByKelasId);
router.post('/soal-exam',verifyUser, createSoalExam);
router.patch('/soal-exam/:id',verifyUser, updateSoalExam);
router.delete('/soal-exam/:id',verifyUser,  deleteSoalExam);

export default router;



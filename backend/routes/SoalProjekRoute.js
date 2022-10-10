import express from "express";
import {
    getSoalProjek,
    getSoalProjekById,
    createSoalProjek,
    deleteSoalProjek,
    updateSoalProjek
} from "../controller/SoalProjekController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/soal-projek',verifyUser, getSoalProjek);
router.get('/soal-projek/:id',verifyUser,  getSoalProjekById);
router.post('/soal-projek',verifyUser, createSoalProjek);
router.patch('/soal-projek/:id',verifyUser, updateSoalProjek);
router.delete('/soal-projek/:id',verifyUser,  deleteSoalProjek);

export default router;



import express from "express";
import {
    getPendaftaranMentor,
    getPendaftaranMentorById,
    createPendaftaranMentor,
    validasiPendaftaranMentor,
    deletePendaftaranMentor,
    uploadFile,
} from "../controller/pendaftaranMentorController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/gabung-mentor',verifyUser, getPendaftaranMentor);
router.get('/gabung-mentor/:id',verifyUser,  getPendaftaranMentorById);
router.post('/gabung-mentor',verifyUser, uploadFile, createPendaftaranMentor);
router.patch('/gabung-mentor/validasi/:id',verifyUser,  validasiPendaftaranMentor);
router.delete('/gabung-mentor/:id',verifyUser,  deletePendaftaranMentor);

export default router;



import express from "express";
import {
    getKelas,
    getKelasById,
    createKelas,
    editKelas,
    deleteKelas,
    uploadImage,
    vadlidateKelas,
} from "../controller/KelasController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/kelas',verifyUser, getKelas);
router.get('/kelas/:id',verifyUser,  getKelasById);
router.post('/kelas',verifyUser, uploadImage, createKelas);
router.patch('/kelas/:id',verifyUser, uploadImage, editKelas);
router.patch('/kelas/validasi/:id',verifyUser, vadlidateKelas);
router.delete('/kelas/:id',verifyUser,  deleteKelas);

export default router;



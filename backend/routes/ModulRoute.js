import express from "express";
import {
    getModul,
    getModulById,
    createModul,
    updateModul,
    deleteModul,
    getModulByKelasId
} from "../controller/modulController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/modul',verifyUser, getModul);
router.get('/modul/:id',verifyUser,  getModulById);
router.get('/modul/kelas/:id',verifyUser,  getModulByKelasId);
router.post('/modul',verifyUser,  createModul);
router.patch('/modul/:id',verifyUser,  updateModul);
router.delete('/modul/:id',verifyUser,  deleteModul);

export default router;



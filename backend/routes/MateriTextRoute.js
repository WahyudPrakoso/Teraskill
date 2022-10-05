import express from "express";
import {
    getMateriText,
    getMateriTextById,
    createMateriText,
    updateMateriText,
    deleteMateriText,
    getMateriTextByModulId
} from "../controller/materiTextController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/materi/text',verifyUser, getMateriText);
router.get('/materi/text/:id',verifyUser,  getMateriTextById);
router.get('/materi/text/modul/:id',verifyUser,  getMateriTextByModulId);
router.post('/materi/text',verifyUser,  createMateriText);
router.patch('/materi/text/:id',verifyUser,  updateMateriText);
router.delete('/materi/text/:id',verifyUser,  deleteMateriText);

export default router;



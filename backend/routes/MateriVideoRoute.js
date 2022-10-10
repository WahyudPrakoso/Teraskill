import express from "express";
import {
    getMateriVideo,
    getMateriVideoById,
    createMateriVideo,
    updateMateriVideo,
    deleteMateriVideo,
    getMateriVideoByModulId
} from "../controller/materiVideoController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router(); 

router.get('/materi/video',verifyUser, getMateriVideo);
router.get('/materi/video/:id',verifyUser,  getMateriVideoById);
router.get('/materi/video/modul/:id',verifyUser,  getMateriVideoByModulId);
router.post('/materi/video',verifyUser,  createMateriVideo);
router.patch('/materi/video/:id',verifyUser,  updateMateriVideo);
router.delete('/materi/video/:id',verifyUser,  deleteMateriVideo);

export default router;



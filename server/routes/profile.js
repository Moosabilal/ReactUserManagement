import express from 'express'
import multer from "multer";
import { getAllUsers, profileUpdate } from '../controllers/profileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.put('/update', authMiddleware,upload.single("profileImage"),profileUpdate)
router.get('/users',authMiddleware,getAllUsers)




export default router;
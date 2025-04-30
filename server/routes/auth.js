import express from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.get('/user',authMiddleware,getUserProfile)



export default router;
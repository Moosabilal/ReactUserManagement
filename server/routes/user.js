import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { createUsers, deleteUser, updateUsers } from '../controllers/profileController.js';



const router = express.Router();

router.put("/update/:id", authMiddleware, updateUsers);
router.delete("/delete/:id", authMiddleware,deleteUser);
router.post("/create",authMiddleware,createUsers)

export default  router;

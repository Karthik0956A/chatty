import express from 'express';
import {login, signup, logout, update_pic, check} from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/login',login);

router.post('/signup',signup);

router.post('/logout',logout);

router.put('/update-pic',protectRoute,update_pic);

router.get('/check',protectRoute,check);
export default router;
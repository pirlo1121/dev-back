import express, { Request, Response } from "express";
import { getUser, login, updateUser, logout } from "../controllers/auth.controller";
import { limiter } from "../middlewares/limiter";
import { auth } from "../middlewares/auth";
const router = express.Router();

router.get('/auth', (req: Request, res: Response) => {
    res.send('app running good!')
});
router.post('/auth/login', limiter, login)
router.post('/auth/logout', logout)
router.put('/update/:id', auth, updateUser)
router.get('/get/:id', auth, getUser)



export default router
import express, { Request, Response } from "express";
import { getUser, login, updateUser, logout, updateUserImage } from "../controllers/auth.controller";
import { limiter } from "../middlewares/limiter";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multer";
const router = express.Router();

router.get('/auth', (req: Request, res: Response) => {
    res.send('app running good!')
});
router.post('/auth/login', limiter, login)
router.post('/auth/logout', logout)
router.put('/update/:id', auth, upload.single('image'), updateUser)
router.patch('/update-image/:id', auth, upload.single('image'), updateUserImage);
router.get('/get/:id', getUser)



export default router
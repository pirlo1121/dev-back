import express from "express";
import { getUser, login, updateUser, logout } from "../controllers/auth.controller.js";
import { limiter } from "../middlewares/limiter.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get('/auth', (req, res) => {
    res.send('app running good!')
});
router.post('/auth/login', limiter, login)
router.post('/auth/logout', logout)
router.put('/update/:id', auth, updateUser)
router.get('/get/:id', auth, getUser)



export default router
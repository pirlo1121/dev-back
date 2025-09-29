import  express  from "express";
import { getUser, login, updateUser } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middlewares/limiter.js";
const router = express.Router();

router.get('/auth',(req, res)=>{
    res.send('app running good!')
});
router.post('/auth/login', loginLimiter ,login )
router.put('/update/:id', updateUser)
router.get('/get/:id', getUser)



export default router
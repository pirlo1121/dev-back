import  express  from "express";
import { getUser, login, updateUser } from "../controllers/auth.controller.js";
import { limiter } from "../middlewares/limiter.js";
const router = express.Router();

router.get('/auth',(req, res)=>{
    res.send('app running good!')
});
router.post('/auth/login', limiter ,login )
router.put('/update/:id', updateUser)
router.get('/get/:id', getUser)



export default router
import  express  from "express";
import { login } from "../controllers/auth.controller.js";
const router = express.Router();

router.get('/auth',(req, res)=>{
    res.send('app running good!')
});

// router.post('/register', )
router.post('/login', login )



export default router
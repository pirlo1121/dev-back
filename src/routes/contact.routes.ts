import express from "express";
import { limiter } from "../middlewares/limiter";
import { sendEmail } from "../controllers/contact.controller";

const router = express.Router();

router.post("/contact", limiter, sendEmail);

export default router;

import express from "express";
import { limiter } from "../middlewares/limiter.js";
import { sendEmail } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/contact",limiter, sendEmail);

export default router;

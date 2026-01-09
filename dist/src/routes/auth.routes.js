"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const limiter_1 = require("../middlewares/limiter");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
router.get('/auth', (req, res) => {
    res.send('app running good!');
});
router.post('/auth/login', limiter_1.limiter, auth_controller_1.login);
router.post('/auth/logout', auth_controller_1.logout);
router.put('/update/:id', auth_1.auth, multer_1.upload.single('image'), auth_controller_1.updateUser);
router.patch('/update-image/:id', auth_1.auth, multer_1.upload.single('image'), auth_controller_1.updateUserImage);
router.get('/get/:id', auth_1.auth, auth_controller_1.getUser);
exports.default = router;

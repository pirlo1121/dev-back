"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projects_controller_1 = require("../controllers/projects.controller");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
router.get('/projects', auth_1.auth, projects_controller_1.getProjects);
router.get('/projects/:id', projects_controller_1.getOneProject);
router.post('/projects', auth_1.auth, multer_1.upload.single('image'), projects_controller_1.createProject);
router.patch('/projects/:id', projects_controller_1.updateProject);
router.delete('/projects/:id', projects_controller_1.deleteProject);
exports.default = router;

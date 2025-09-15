import express from 'express';
import { createProject, deleteProject, getOneProject, getProjects, updateProject } from '../controllers/projects.controller.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
const router = express.Router();

router.get('/projects', auth, getProjects)
router.get('/projects/:id', getOneProject)
router.post('/projects',auth, upload.single('image'), createProject)
router.patch('/projects/:id', updateProject)
router.delete('/projects/:id', deleteProject)


export default router
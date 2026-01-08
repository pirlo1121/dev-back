import express from 'express';
import { createProject, deleteProject, getOneProject, getProjects, updateProject } from '../controllers/projects.controller';
import { auth } from '../middlewares/auth';
import { upload } from '../middlewares/multer';
const router = express.Router();

router.get('/projects', getProjects)
router.get('/projects/:id', getOneProject)
router.post('/projects', auth, upload.single('image'), createProject)
router.patch('/projects/:id',auth, updateProject)
router.delete('/projects/:id',auth, deleteProject)


export default router
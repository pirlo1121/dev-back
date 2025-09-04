import express from 'express';
import { createProject, deleteProject, getOneProject, getProjects, updateProject } from '../controllers/projects.controller.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/projects', auth, getProjects)
router.get('/projects/:id', getOneProject)
router.post('/projects',auth, createProject)
router.patch('/projects/:id', updateProject)
router.delete('/projects/:id', deleteProject)


export default router
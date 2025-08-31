import express from 'express';
import { createProject, deleteProject, getOneProject, getProjects, updateProject } from '../controllers/projects.controller.js';
const router = express.Router();

router.get('/projects', getProjects)
router.get('/projects/:id', getOneProject)
router.post('/projects', createProject)
router.patch('/projects/:id', updateProject)
router.delete('/projects/:id', deleteProject)


export default router
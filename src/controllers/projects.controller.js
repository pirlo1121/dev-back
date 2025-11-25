// src/controllers/projects.controller.js
import mongoose from 'mongoose';
import { uploadToS3 } from "../middlewares/multer.js";
import { Projects } from "../models/projects.models.js";
import { 
  BadRequestError, 
  NotFoundError,
  ConflictError 
} from '../errors/customErrors.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Projects.find().lean();
  return res.status(200).json({ ok: true, projects });
});

export const getOneProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("ID inválido");
  }

  const project = await Projects.findById(id).lean();
  
  if (!project) {
    throw new NotFoundError("Proyecto no encontrado");
  }

  return res.status(200).json({ ok: true, project });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, deploy, repository, stack } = req.body;
  const userId = req.user.id;

  if (!name || !description || !repository || !stack) {
    throw new BadRequestError("Ingresa todos los campos requeridos");
  }

  if (!req.file) {
    throw new BadRequestError("La imagen es requerida");
  }

  const url = await uploadToS3(req.file);

  const data = { 
    name, 
    description, 
    deploy, 
    repository, 
    stack, 
    userId,
    image: url 
  };

  const project = await Projects.create(data);

  return res.status(201).json({ ok: true, project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("ID inválido");
  }

  const allowed = ["name", "description", "deploy", "repository", "stack"];
  const updates = Object.fromEntries(
    Object.entries(req.body || {}).filter(([k]) => allowed.includes(k))
  );

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("Nada que actualizar");
  }

  if ("stack" in updates && !Array.isArray(updates.stack)) {
    throw new BadRequestError("stack debe ser un array");
  }

  const project = await Projects.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    lean: true
  });

  if (!project) {
    throw new NotFoundError("Proyecto no encontrado");
  }

  return res.status(200).json({ ok: true, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("ID inválido");
  }

  const deleted = await Projects.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new NotFoundError("Proyecto no encontrado");
  }

  return res.status(200).json({ ok: true, msg: "Proyecto eliminado" });
});
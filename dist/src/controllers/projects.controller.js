"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getOneProject = exports.getProjects = void 0;
// src/controllers/projects.controller.js
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = require("../middlewares/multer");
const projects_models_1 = require("../models/projects.models");
const customErrors_1 = require("../errors/customErrors");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const projects = await projects_models_1.Projects.find().lean();
    return res.status(200).json({ ok: true, projects });
});
exports.getOneProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new customErrors_1.BadRequestError("ID inválido");
    }
    const project = await projects_models_1.Projects.findById(id).lean();
    if (!project) {
        throw new customErrors_1.NotFoundError("Proyecto no encontrado");
    }
    return res.status(200).json({ ok: true, project });
});
exports.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, description, deploy, repository, stack } = req.body;
    const userId = req.user?.id; // Assuming user is decoded token with id
    if (!name || !description || !repository || !stack) {
        throw new customErrors_1.BadRequestError("Ingresa todos los campos requeridos");
    }
    if (!req.file) {
        throw new customErrors_1.BadRequestError("La imagen es requerida");
    }
    const url = await (0, multer_1.uploadToS3)(req.file);
    const data = {
        name,
        description,
        deploy,
        repository,
        stack,
        userId,
        image: url
    };
    const project = await projects_models_1.Projects.create(data);
    return res.status(201).json({ ok: true, project });
});
exports.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new customErrors_1.BadRequestError("ID inválido");
    }
    const allowed = ["name", "description", "deploy", "repository", "stack"];
    const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([k]) => allowed.includes(k)));
    if (Object.keys(updates).length === 0) {
        throw new customErrors_1.BadRequestError("Nada que actualizar");
    }
    if ("stack" in updates && !Array.isArray(updates.stack)) {
        throw new customErrors_1.BadRequestError("stack debe ser un array");
    }
    const project = await projects_models_1.Projects.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        lean: true
    });
    if (!project) {
        throw new customErrors_1.NotFoundError("Proyecto no encontrado");
    }
    return res.status(200).json({ ok: true, project });
});
exports.deleteProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new customErrors_1.BadRequestError("ID inválido");
    }
    const deleted = await projects_models_1.Projects.findByIdAndDelete(id).lean();
    if (!deleted) {
        throw new customErrors_1.NotFoundError("Proyecto no encontrado");
    }
    return res.status(200).json({ ok: true, msg: "Proyecto eliminado" });
});

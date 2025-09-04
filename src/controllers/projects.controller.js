import { Projects } from "../models/projects.models.js";


export async function getProjects(req, res) {
  try {
    const projects = await Projects.find().lean();
    return res.status(200).json({ ok: true, projects: projects });
  } catch (error) {
    console.error("getProjects error:", error);
    return res.status(500).json({ ok: false, msg: "Error interno" });
  }
}

export async function getOneProject(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    const project = await Projects.findById(id).lean();
    if (!project) {
      return res.status(404).json({ ok: false, msg: "Proyecto no encontrado" });
    }

    return res.status(200).json({ ok: true, project });
  } catch (error) {
    console.error("getOneProject error:", error);
    return res.status(500).json({ ok: false, msg: "Error interno" });
  }
}

export async function createProject(req, res) {
  try {
    const { name, description, deploy, repository, stack } = req.body;
    const userId = req.user.id
    if (!name || !description || !repository || !stack) {
      return res
        .status(400)
        .json({ ok: false, msg: "Ingresa todos los campos requeridos" });
    }
    if (!Array.isArray(stack)) {
      return res.status(400).json({ ok: false, msg: "stack debe ser un array" });
    }

    const data = { name, description, deploy, repository, stack, userId };
    

    const project = await Projects.create(data);

    return res.status(201).json({ ok: true, project });
  } catch (error) {
    console.error("createProject error:", error);

    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ ok: false, msg: "Conflicto: ya existe un proyecto con esos datos" });
    }

    return res.status(500).json({ ok: false, msg: "Error interno" });
  }
}

export async function updateProject(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    const allowed = ["name", "description", "deploy", "repository", "stack"];
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([k]) => allowed.includes(k))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ ok: false, msg: "Nada que actualizar" });
    }

    if ("stack" in updates && !Array.isArray(updates.stack)) {
      return res.status(400).json({ ok: false, msg: "stack debe ser un array" });
    }

    const project = await Projects.findByIdAndUpdate(id, updates, {
      new: true,           
      runValidators: true, 
      lean: true           
    });

    if (!project) {
      return res.status(404).json({ ok: false, msg: "Proyecto no encontrado" });
    }

    return res.status(200).json({ ok: true, project });
  } catch (error) {
    console.error("updateProject error:", error);
    return res.status(500).json({ ok: false, msg: "Error interno" });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    const deleted = await Projects.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ ok: false, msg: "Proyecto no encontrado" });
    }

    return res.status(200).json({ ok: true, msg: "Proyecto eliminado" });

  } catch (error) {

    console.error("deleteProject error:", error);
    return res.status(500).json({ ok: false, msg: "Error interno" });

  }
}
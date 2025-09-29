import { comparePass, createToken } from "../helpers/helper.hash.js";
import  { User }  from "../models/users.models.js";

export async function login(req, res) {
  try {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: "Ingresa correo y contraseña" });
    }

    email = String(email).trim().toLowerCase();

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    // comparePass 
    const passMatch = await comparePass(password, userFound.password);
    if (!passMatch) {
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });
    }

    const token = createToken({
      id: userFound._id.toString(),
      email: userFound.email,
      role: userFound.role ?? "user",
    });

    const { password: _omit, ...publicUser } = userFound.toObject();

    return res.status(200).json({ ok: true, user: publicUser, token });

  } catch (error) {
    console.error("[login] error:", error);
    return res.status(500).json({ ok: false, msg: "Error interno" });
  }
}

export async function getUser(req,res) {

 try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ok: true, user})
  } catch (error) {
    console.error(" Error al obtener usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
  
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;  
    const updateData = { ...req.body };

    if (updateData.password) {
      return res.status(400).json({ message: "No puedes actualizar la contraseña desde este endpoint" });
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true 
    }).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
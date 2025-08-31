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

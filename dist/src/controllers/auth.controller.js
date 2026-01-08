"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.logout = exports.login = void 0;
// src/controllers/auth.controller.js
const helper_hash_1 = require("../helpers/helper.hash");
const users_models_1 = require("../models/users.models");
const customErrors_1 = require("../errors/customErrors");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
        throw new customErrors_1.BadRequestError("Ingresa correo y contraseña");
    }
    email = String(email).trim().toLowerCase();
    const userFound = await users_models_1.User.findOne({ email });
    if (!userFound) {
        throw new customErrors_1.UnauthorizedError("Credenciales inválidas");
    }
    const passMatch = await (0, helper_hash_1.comparePass)(password, userFound.password);
    if (!passMatch) {
        throw new customErrors_1.UnauthorizedError("Credenciales inválidas");
    }
    const token = (0, helper_hash_1.createToken)({
        id: userFound._id.toString(),
        email: userFound.email,
        role: userFound.role ?? "user",
    });
    const { password: _omit, ...publicUser } = userFound.toObject();
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    return res.status(200).json({ ok: true, user: publicUser });
});
const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ ok: true, message: 'Logged out successfully' });
};
exports.logout = logout;
exports.getUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await users_models_1.User.findById(id).select("-password");
    if (!user) {
        throw new customErrors_1.NotFoundError("Usuario no encontrado");
    }
    return res.status(200).json({ ok: true, user });
});
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
        throw new customErrors_1.BadRequestError("No puedes actualizar la contraseña desde este endpoint");
    }
    const user = await users_models_1.User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).select("-password");
    if (!user) {
        throw new customErrors_1.NotFoundError("Usuario no encontrado");
    }
    res.json({ ok: true, user });
});

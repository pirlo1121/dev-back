// src/controllers/auth.controller.js
import { uploadToS3 } from "../middlewares/multer";
import { comparePass, createToken } from "../helpers/helper.hash";
import { User } from "../models/users.models";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from '../errors/customErrors';
import { asyncHandler } from '../middlewares/errorHandler';
import { Request, Response } from 'express';

export const login = asyncHandler(async (req: Request, res: Response) => {
  let { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new BadRequestError("Ingresa correo y contraseña");
  }

  email = String(email).trim().toLowerCase();
  const userFound = await User.findOne({ email });

  if (!userFound) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const passMatch = await comparePass(password, userFound.password as string);
  if (!passMatch) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const token = createToken({
    id: (userFound as any)._id.toString(),
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

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ ok: true, message: 'Logged out successfully' });
};

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return res.status(200).json({ ok: true, user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (updateData.password) {
    throw new BadRequestError(
      "No puedes actualizar la contraseña desde este endpoint"
    );
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!user) {
    throw new NotFoundError("Usuario no encontrado");
  }

  res.json({ ok: true, user });
});

export const updateUserImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.file) {
    throw new BadRequestError("No se ha subido ninguna imagen");
  }

  const imageUrl = await uploadToS3(req.file);

  const user = await User.findByIdAndUpdate(id, { image: imageUrl }, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!user) {
    throw new NotFoundError("Usuario no encontrado");
  }

  res.json({ ok: true, user });
});
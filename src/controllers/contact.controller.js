// src/controllers/contact.controller.js
import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import { BadRequestError, InternalServerError } from "../errors/customErrors.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

configDotenv();

// Validación de email simple
const isValidEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

export const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validaciones
  if (!name?.trim()) {
    throw new BadRequestError("El nombre es requerido");
  }

  if (!email?.trim()) {
    throw new BadRequestError("El email es requerido");
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError("El email no es válido");
  }

  if (!message?.trim()) {
    throw new BadRequestError("El mensaje es requerido");
  }

  if (message.trim().length < 10) {
    throw new BadRequestError("El mensaje debe tener al menos 10 caracteres");
  }

  if (message.trim().length > 1000) {
    throw new BadRequestError("El mensaje no puede exceder 1000 caracteres");
  }

  // Configurar transporte
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_SEND,
      pass: process.env.CONTACT_PASSWORD,
    },
  });

  try {
    // Enviar email
    await transporter.sendMail({
      from: `"Portafolio Web" <${process.env.CONTACT_EMAIL_SEND}>`,
      to: process.env.CONTACT_EMAIL_ME,
      replyTo: email, 
      subject: `📧 Nuevo mensaje de ${name}`,
      text: `
Nuevo contacto desde tu portafolio
-----------------------------------
Nombre: ${name}
Correo: ${email}
Mensaje:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            📧 Nuevo mensaje de contacto
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Correo:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50;">
            <h3 style="color: #666; margin-top: 0;">Mensaje:</h3>
            <p style="color: #333; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Este mensaje fue enviado desde tu portafolio web.
          </p>
        </div>
      `,
    });

    res.status(200).json({ 
      ok: true, 
      msg: "Mensaje enviado correctamente" 
    });

  } catch (error) {
    console.error("Error de Nodemailer:", error);
    
    // Errores específicos de nodemailer
    if (error.code === 'EAUTH') {
      throw new InternalServerError("Error de autenticación del servidor de correo");
    }
    
    if (error.code === 'ECONNECTION') {
      throw new InternalServerError("No se pudo conectar al servidor de correo");
    }

    throw new InternalServerError("Error al enviar el mensaje. Intenta nuevamente más tarde");
  }
});
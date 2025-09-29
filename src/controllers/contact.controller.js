import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export async function sendEmail(req, res) {
  const { name, email, message } = req.body;

  try {
    // Transporte
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.CONTACT_EMAIL_SEND,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    // Opciones
    await transporter.sendMail({
      from: `"Portafolio Web" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL_ME, // donde recibes el mensaje
      subject: `Nuevo mensaje de ${name}`,
      text: `
       Nuevo contacto desde tu portafolio
      -----------------------------------
      Nombre: ${name}
      Correo: ${email}
      Mensaje:
      ${message}
      `,
    });

    res.status(200).json({ msg: "Mensaje enviado correctamente " });
  } catch (error) {
    console.error("Error enviando el correo:", error);
    res.status(500).json({ msg: "Error al enviar el mensaje " });
  }
}
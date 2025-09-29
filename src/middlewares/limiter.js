import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 4, 
  message: {
    message: "Demasiados intentos de inicio de sesión, inténtalo de nuevo más tarde."
  },
  standardHeaders: true, // incluye info en headers RateLimit
  legacyHeaders: false,  // desactivar X-RateLimit-*
});

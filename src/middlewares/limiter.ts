import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: {
    message: "Demasiados intentos de inicio de sesión, inténtalo de nuevo más tarde."
  },
  standardHeaders: true, // incluye info en headers RateLimit
  legacyHeaders: false,  // desactivar X-RateLimit-*
});


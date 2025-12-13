// src/middlewares/errorHandler.js
import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  // Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: false,
      message: "Datos inválidos",
      errors: err.message,
    });
  }

  // Errores personalizados con statusCode
  const status = err.statusCode || 500;

  return res.status(status).json({
    status: false,
    message: err.message || "Error interno del servidor",
    errors: err.errors || null,
  });
};

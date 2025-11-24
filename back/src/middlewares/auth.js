import { admin } from "../database/firebase.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ status: false, message: "Usuario no autenticado." });
    }

    const token = authHeader.split(" ")[1];

    // Verifica el JWT de Firebase
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded) {
      return res.status(401).json({ status: false, message: "Token inválido o expirado" });
    }

    req.user = decoded; // uid, email, provider, etc.
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({ status: false, message: "Token inválido o expirado" });
  }
};


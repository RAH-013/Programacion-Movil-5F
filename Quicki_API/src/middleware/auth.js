import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Se requiere credenciales." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Credencial invalida." });
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

export const authorizeEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Requieres una cuenta de empleador." });
  }
  next();
};

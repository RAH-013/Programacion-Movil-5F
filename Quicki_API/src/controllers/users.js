import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/index.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "El correo ya esta en uso." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phoneNumber,
      role,
    });

    const token = jwt.sign({ id: user.id, fullName: user.fullName, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Usuario registrado.",
      user: {
        fullName: user.fullName,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error al registrarte: " + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign({ id: user.id, fullName: user.fullName, role: user.role }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({
      message: "Sesión iniciada.",
      user: {
        fullName: user.fullName,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión: " + err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["id", "passwordHash", "createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el perfil: " + err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { fullName, phoneNumber, prevPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    let hasChanges = false;

    if (fullName && fullName !== user.fullName) {
      user.fullName = fullName;
      hasChanges = true;
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      user.phoneNumber = phoneNumber;
      hasChanges = true;
    }

    if (newPassword) {
      if (!prevPassword) return res.status(400).json({ message: "La contraseña actual es obligatoria para actualizarla." });

      const match = await bcrypt.compare(prevPassword, user.passwordHash);

      if (!match) {
        return res.status(401).json({ message: "Contraseña actual incorrecta." });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(400).json({ message: "No hay cambios para actualizar." });
    }

    await user.save();
    res.json({ message: "Perfil actualizado correctamente." });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el perfil: " + err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await user.destroy();
    res.json({ message: "Cuenta eliminada correctamente." });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar la cuenta: " + err.message });
  }
};

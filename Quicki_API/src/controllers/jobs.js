import { Op, fn, col, where as sequelizeWhere } from "sequelize";

import { Job } from "../models/index.js";

export const getJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const where = {};

    if (userRole === "employer") {
      where.employer_id = userId;
    }

    const jobs = await Job.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!jobs.length) {
      return res.status(404).json({ message: "No se encontraron trabajos." });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los trabajos.", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Trabajo no encontrado." });
    }

    if (userRole === "employer" && job.employer_id !== userId) {
      return res.status(403).json({ message: "No tienes permiso para ver este trabajo." });
    }

    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el trabajo por ID.", error: err.message });
  }
};

export const searchJobByData = async (req, res) => {
  try {
    const { query } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!query) {
      return res.status(400).json({ message: "Debes proporcionar una palabra de búsqueda." });
    }

    const words = query.toLowerCase().split(" ");

    const orConditions = words.map((word) => ({
      [Op.or]: [
        sequelizeWhere(fn("LOWER", col("type")), { [Op.like]: `%${word}%` }),
        sequelizeWhere(fn("LOWER", col("description")), { [Op.like]: `%${word}%` }),
        sequelizeWhere(fn("LOWER", col("location")), { [Op.like]: `%${word}%` }),
        sequelizeWhere(fn("LOWER", col("payment")), { [Op.like]: `%${word}%` }),
      ],
    }));

    const where = { [Op.and]: orConditions };

    if (userRole === "employer") {
      where[Op.and].push({ employer_id: userId });
    }

    const jobs = await Job.findAll({ where });

    if (!jobs.length) {
      return res.status(404).json({ message: "No se encontraron trabajos que coincidan con la búsqueda." });
    }

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Error al buscar trabajos.", error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, description, location, payment } = req.body;

    if (!type || !description || !location || !payment) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    await Job.create({
      type,
      description,
      location,
      payment,
      employerId: userId,
    });

    res.status(201).json({ message: "Trabajo creado." });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el trabajo.", error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, location, payment } = req.body;
    const userId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job || job.employer_id !== userId) {
      return res.status(404).json({ message: "Trabajo no encontrado o no autorizado." });
    }

    let hasChanges = false;

    if (type && type !== job.type) {
      job.type = type;
      hasChanges = true;
    }
    if (description && description !== job.description) {
      job.description = description;
      hasChanges = true;
    }
    if (location && location !== job.location) {
      job.location = location;
      hasChanges = true;
    }
    if (payment && payment !== job.payment) {
      job.payment = payment;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(400).json({ message: "No hay cambios para actualizar." });
    }

    await job.save();
    res.json({ message: "Trabajo actualizado correctamente." });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el trabajo.", error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job || job.employer_id !== userId) {
      return res.status(404).json({ message: "Trabajo no encontrado o no autorizado." });
    }

    await job.destroy();
    res.json({ message: "Trabajo eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el trabajo.", error: err.message });
  }
};

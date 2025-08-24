import { Op } from "sequelize";
import { Job, JobApplication } from "../models/index.js";

export const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await JobApplication.findAll({
      include: [
        {
          model: Job,
          where: { employerId: userId },
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!applications.length) {
      return res.status(404).json({ message: "No se encontraron aplicaciones." });
    }

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las aplicaciones.", error: err.message });
  }
};

export const jobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Trabajo no encontrado." });
    }

    await JobApplication.create({
      jobId: id,
      workerId: userId,
    });

    res.status(201).json({ message: "Aplicación al trabajo enviada." });
  } catch (err) {
    res.status(500).json({ message: "Error al aplicar al trabajo.", error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectOthers, hiddenJob } = req.body;
    const userId = req.user.id;

    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: "Aplicación no encontrada." });
    }

    const job = await Job.findByPk(application.jobId);

    if (job.employerId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para actualizar esta aplicación." });
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido." });
    }

    application.status = status;

    if (status === "accepted") {
      if (rejectOthers) {
        const otherApplications = await JobApplication.findAll({
          where: {
            jobId: application.jobId,
            id: { [Op.ne]: id },
          },
        });

        for (const otherApp of otherApplications) {
          otherApp.status = "rejected";
          await otherApp.save();
        }
      }

      if (hiddenJob) {
        job.status = false;
        await job.save();
      }
    }

    await application.save();

    res.json({ message: "Estado de la aplicación actualizado." });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el estado de la aplicación.", error: err.message });
  }
};

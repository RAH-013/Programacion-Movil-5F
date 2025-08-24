import { Router } from "express";
import { getJobs, getJobById, searchJobByData, createJob, updateJob, deleteJob } from "../controllers/jobs.js";
import { authenticate, authorizeEmployer } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getJobs);
router.get("/:id", authenticate, getJobById);
router.get("/search/:query", authenticate, searchJobByData);

router.post("/", authenticate, authorizeEmployer, createJob);
router.put("/:id", authenticate, authorizeEmployer, updateJob);
router.delete("/:id", authenticate, authorizeEmployer, deleteJob);

export default router;

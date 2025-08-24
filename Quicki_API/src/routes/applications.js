import { Router } from "express";
import { getApplications, jobApplication, updateApplicationStatus } from "../controllers/applications.js";
import { authenticate, authorizeEmployer } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, authorizeEmployer, getApplications);

router.post("/:id", authenticate, jobApplication);

router.put("/:id", authenticate, authorizeEmployer, updateApplicationStatus);

export default router;

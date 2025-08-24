import { Router } from "express";
import { register, login, getProfile, updateProfile, deleteAccount } from "../controllers/users.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/sign-up", register);
router.post("/sign-in", login);

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.delete("/me", authenticate, deleteAccount);

export default router;

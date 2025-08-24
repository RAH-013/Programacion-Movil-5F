import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONT_URI,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

// sequelize
//   .sync({ alter: true })
//   .then(() => console.log("Database synchronized"))
//   .catch((err) => console.error("DB sync error:", err));

app.listen(PORT, () => console.log(`API REST running on port ${PORT}`));

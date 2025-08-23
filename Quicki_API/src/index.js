import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { sequelize } from "./models/index.js";

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

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("DB sync error:", err));

app.listen(PORT, () => console.log(`API REST running on port ${PORT}`));

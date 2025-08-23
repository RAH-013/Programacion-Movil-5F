import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db.js";

const JobApplication = sequelize.define(
  "job_applications",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  },
  { timestamps: true }
);

export default JobApplication;

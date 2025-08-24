import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db.js";

const JobApplication = sequelize.define(
  "applications",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    jobId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    workerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "accepted", "rejected"]],
      },
    },
  },
  { timestamps: true }
);

export default JobApplication;

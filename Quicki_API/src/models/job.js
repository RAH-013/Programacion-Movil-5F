import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db.js";

const Job = sequelize.define(
  "jobs",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true }
);

export default Job;

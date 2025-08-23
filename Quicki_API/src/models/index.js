import sequelize from "../config/db.js";

import User from "./user.js";
import Job from "./job.js";
import JobApplication from "./applications.js";

// Relación Employer → Job (1:N)
User.hasMany(Job, { as: "jobsCreated", foreignKey: "employer_id" });
Job.belongsTo(User, { as: "employer", foreignKey: "employer_id" });

// Relación Worker ↔ Job (N:M) a través de JobApplication
User.belongsToMany(Job, { through: JobApplication, as: "appliedJobs", foreignKey: "worker_id" });
Job.belongsToMany(User, { through: JobApplication, as: "applicants", foreignKey: "job_id" });

export { sequelize, User, Job, JobApplication };

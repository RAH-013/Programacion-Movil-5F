import sequelize from "../config/db.js";

import User from "./user.js";
import Job from "./job.js";
import JobApplication from "./applications.js";

// Relación Employer → Job (1:N)
User.hasMany(Job, { as: "jobsCreated", foreignKey: "employerId" });
Job.belongsTo(User, { as: "employer", foreignKey: "employerId" });

// Relación Worker ↔ Job (N:M) a través de JobApplication
User.belongsToMany(Job, { through: JobApplication, as: "appliedJobs", foreignKey: "workerId" });
Job.belongsToMany(User, { through: JobApplication, as: "applicants", foreignKey: "jobId" });

// JobApplication pertenece a Job
JobApplication.belongsTo(Job, { foreignKey: "jobId" });
Job.hasMany(JobApplication, { foreignKey: "jobId" });

// JobApplication pertenece a User (el trabajador)
JobApplication.belongsTo(User, { foreignKey: "workerId" });
User.hasMany(JobApplication, { foreignKey: "workerId" });

export { sequelize, User, Job, JobApplication };

import express from "express";
import { getJobById, getJobs, applyJob } from "../controllers/jobController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all jobs
router.get("/", getJobs);

// Get a single job by ID
router.get("/:id", getJobById);

// Apply for a job - Fixed route
router.post("/apply", authenticateUser, applyJob);

export default router;
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password"
    });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "-password"
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?._id; // Comes from authMiddleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Prevent duplicate applications
    const alreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "Already applied for this job" });
    }

    const application = new JobApplication({ jobId, userId });
    await application.save();

    res.json({ success: true, message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

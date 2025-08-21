import Company from "../models/Company.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js"; // ADD THIS LINE

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });

    await newJob.save();
    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });
  
    // Adding number of applications info data
    const jobsData = await Promise.all(jobs.map(async (job) => {
      const applicants = await JobApplication.find({ jobId: job._id });
      return { ...job.toObject(), applicants: applicants.length };
    }));
    
    // FIXED: Return jobsData instead of jobs
    res.json({ success: true, jobs: jobsData }); // Changed from jobsData: jobs to jobs: jobsData
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job visibility
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);
    if (!job) return res.json({ success: false, message: "Job not found" });

    if (companyId.toString() !== job.companyId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, message: "Job visibility updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// (Optional placeholders to keep your original exports)
export const getJobApplicants = async (req, res) => {
  res.json({ success: true, applicants: [] });
};

export const changeApplicationStatus = async (req, res) => {
  res.json({ success: true, message: "Status change stub" });
};
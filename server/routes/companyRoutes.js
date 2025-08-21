import express from "express";
import { protectCompany } from "../middleware/authMiddleware.js";
import {
  getCompanyData,
  loginCompany,
  registerCompany,
  postJob,
  getJobApplicants,
  getCompanyPostedJobs,
  changeApplicationStatus,
  changeJobVisibility
} from "../controllers/companyController.js";
import upload from "../config/multer.js";

const router = express.Router();

// register a company
router.post('/register', upload.single('image'), registerCompany);

// company login
router.post('/login', loginCompany);

// get company data
router.post('/company', protectCompany, getCompanyData);

// post a job
router.post('/post-job', protectCompany, postJob);

// get applicant data 
router.post('/applicants', protectCompany, getJobApplicants);

// get company job list
router.post('/list-jobs', protectCompany, getCompanyPostedJobs);

// change application status
router.post('/change-status', protectCompany, changeApplicationStatus);

// change application visibility
router.post('/change-visibility', protectCompany, changeJobVisibility);

export default router;

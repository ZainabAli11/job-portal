import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import {v2 as cloudinary} from 'cloudinary'

// get user data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.auth.userId;

    try {
        const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });
        if (isAlreadyApplied) {
            return res.json({ success: false, message: "You have already applied for this job" });
        }

        const jobData = await Job.findById(jobId);
        if (!jobData) {
            return res.json({ success: false, message: "Job not found" });
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        res.json({ success: true, message: "Job applied successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get user applied applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const applications = await JobApplication.find({ userId })
            .populate("companyId", "name email image")
            .populate("jobId", "title description location category level salary")
            .exec();

        if (!applications || applications.length === 0) {
            return res.json({ success: false, message: "No applications found" });
        }

        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// update user resume (stub for now)
export const updateUserResume = async (req, res) => {
    try{

        const userId = req.auth.userId;
        const resumeFile=req.file

        const userData=await User.findById(userId)
        if(resumeFile)
        {
            const resumeUpload=await cloudinary.uploader.upload(resumeFile.path)
            userData.resume=resumeUpload.secure_url
        }
        await userData.save()
        res.json({success:true,user:userData})
    }
    catch(error)
    {
        res.json({success:false,message:error.message})

    }
}

import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // <-- changed from ObjectId to String
  jobId:  { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, default: "pending" },
  date:   { type: Date, default: Date.now }
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
export default JobApplication;

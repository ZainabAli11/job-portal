import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { SignInButton, useUser, useAuth } from "@clerk/clerk-react"; // Changed useClerk to useAuth

const ApplyJob = () => {
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { jobs, backendUrl, userApplications } = useContext(AppContext);
  const { isSignedIn } = useUser();
  const { getToken } = useAuth(); // Changed from useClerk to useAuth

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) setJobData(data.job);
      else toast.error(data.message);
    } catch (error) {
      console.error("Fetch job error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch job details");
    }
  };

  const checkAlreadyApplied = () => {
    if (!JobData) return;
    const hasApplied = userApplications.some(
      (item) => item.jobId._id === JobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  const applyHandler = async () => {
    if (!isSignedIn) return toast.error("Login to apply");
    if (isAlreadyApplied) return toast.error("Already applied to this job");

    setIsApplying(true);
    try {
      const token = await getToken();
      console.log("Token received:", token); // Debug log
      
      const { data } = await axios.post(
        `${backendUrl}/api/jobs/apply`,
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Apply job error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to apply for job");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => { fetchJob(); }, [id]);
  useEffect(() => { checkAlreadyApplied(); }, [JobData, userApplications]);

  if (!JobData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.companyId.image}
                alt={JobData.companyId.name}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="Company" />
                    {JobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="Location" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="Level" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="Salary" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-end text-sm max-md:max-auto max-md:text-center">
              {isSignedIn ? (
                <button
                  onClick={applyHandler}
                  disabled={isAlreadyApplied || isApplying}
                  className={`p-2.5 px-10 rounded cursor-pointer transition-colors ${
                    isAlreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : isApplying
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isAlreadyApplied ? "Already Applied" : isApplying ? "Applying..." : "Apply Now"}
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="p-2.5 px-10 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Login to Apply
                  </button>
                </SignInButton>
              )}
              <p className="mt-1 text-gray-600">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              />
              {isSignedIn ? (
                <button
                  onClick={applyHandler}
                  disabled={isAlreadyApplied || isApplying}
                  className={`mt-10 p-2.5 px-10 rounded cursor-pointer transition-colors ${
                    isAlreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : isApplying
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isAlreadyApplied ? "Already Applied" : isApplying ? "Applying..." : "Apply Now"}
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="mt-10 p-2.5 px-10 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Login to Apply
                  </button>
                </SignInButton>
              )}
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="font-bold text-xl mb-4">
                More jobs from {JobData.companyId.name}
              </h2>
              {jobs
                .filter((job) => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={job._id || index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import jobApplications from '../assets/assets';
import { toast } from 'react-toastify';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const { backendUrl, companyToken } = useContext(AppContext);

  // Fetch company jobs
  const fetchCompanyJobs = async () => {
    if (!companyToken) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/company/list-jobs`,
        {},
        { headers: { token: companyToken } }
      );

      // Ensure jobs is always an array
      const jobsArray = Array.isArray(res.data.jobs)
        ? res.data.jobs
        : res.data.jobs
        ? Object.values(res.data.jobs)
        : [];

      setJobs(jobsArray);

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || err.message || "Failed to fetch jobs");
      setJobs([]); // fallback
    }
  };

  // Change job visibility
  const changeJobVisibility = async (id) => {
    if (!companyToken) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs(); // refresh jobs after update
      } else {
        toast.error(data.message || "Failed to change visibility");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to change visibility");
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyToken]);

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 border-b text-center">Applicants</th>
              <th className="py-2 px-4 border-b text-left">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr key={job._id || index} className="text-gray-700">
                  <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{job.title || "No Title"}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.date ? moment(job.date).format('ll') : "-"}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">{job.location || "-"}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {Array.isArray(job.applicants) ? job.applicants.length : 0}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      className="scale-125 ml-4 cursor-pointer"
                      checked={!!job.visible}
                      onChange={() => changeJobVisibility(job._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No jobs posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="cursor-pointer bg-black text-white px-4 py-2 rounded"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;

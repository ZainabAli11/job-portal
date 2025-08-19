import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import assets, { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Resume Section */}
        <h2 className="text-xl font-semibold mb-3">Your Resume</h2>
        <div className="flex gap-2 mb-6">
          {isEdit ? (
            <>
              <label
                className="flex items-center cursor-pointer"
                htmlFor="resumeUpload"
              >
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  Select Resume
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img
                  src={assets.profile_upload_icon}
                  alt=""
                  className="w-6 h-6"
                />
              </label>
              <button
                onClick={() => setIsEdit(false)}
                className="cursor-pointer bg-green-100 border border-green-400 text-green-700 rounded-lg px-4 py-2"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href="#"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="cursor-pointer text-gray-600 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Jobs Applied Section */}
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobsApplied.map((job, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-6 py-3 flex items-center gap-2">
                    <img src={job.logo} alt="" className="w-10 h-10 rounded" />
                    <span>{job.company}</span>
                  </td>
                  <td className="px-6 py-3">{job.title}</td>
                  <td className="px-6 py-3">{job.location}</td>
                  <td className="px-6 py-3">{moment(job.date).format('ll')}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : job.status === 'Accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Applications

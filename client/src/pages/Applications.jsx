import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import assets, { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const {backendUrl,userData,userApplications,fetchUserData}=useContext(AppContext)
  const {user}=useUser ()
  const {getToken}=useAuth()

  const updateResume = async () => {
    try {
      const formData=new FormData()
      formData.append('resume',resume)

      const token=await getToken()
      const {data}=await axios.post(backendUrl+'/api/users/update-resume',
        formData,
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      )
      if(data.success){
        toast.success(data.message)
       await fetchUserData()

      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
    setIsEdit(false)
  }
    

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Resume Section */}
        <h2 className="text-xl font-semibold mb-3">Your Resume</h2>
        <div className="flex gap-2 mb-6">
          {isEdit || userData && userData.resume===""
          ? (
            <>
              <label
                className="flex items-center cursor-pointer"
                htmlFor="resumeUpload"
              >
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  {resume ? resume.name : "Select Resume"}
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
                onClick={updateResume}
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
              {userApplications.map((job, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-6 py-3 flex items-center gap-2">
                    <img src={job.companyId.image} alt="" className="w-10 h-10 rounded" />
                    <span>{job.companyId.name}</span>
                  </td>
                  <td className="px-6 py-3">{job.jobId.title}</td>
                  <td className="px-6 py-3">{job.jobId.location}</td>
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

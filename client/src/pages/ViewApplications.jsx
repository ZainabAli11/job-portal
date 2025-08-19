import React from 'react'
import { viewApplicationsPageData } from '../assets/assets'
import assets from '../assets/assets';

const ViewApplications = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className='w-full text-sm sm:text-base'>
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className='py-3 px-4 text-left'>#</th>
                <th className='py-3 px-4 text-left'>User Name</th>
                <th className='py-3 px-4 text-left max-sm:hidden'>Job Title</th>
                <th className='py-3 px-4 text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 text-left'>Resume</th>
                <th className='py-3 px-4 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {viewApplicationsPageData.map((applicant, index) => (
                <tr key={index} className={`text-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                  <td className='py-2 px-4 border-b flex items-center gap-2'>
                    <img className='w-10 h-10 rounded-full max-sm:hidden' src={applicant.imgSrc} alt="" />
                    <span>{applicant.name}</span>
                  </td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobTitle}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.location}</td>
                  <td className='py-2 px-4 border-b text-center'>
                    <a href='' target='_blank'
                      className='bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center'>
                      Resume <img src={assets.resume_download_icon} alt='' />
                    </a>
                  </td>
                  <td className='py-2 px-4 border-b text-center'>
                    <div className='relative inline-block text-left group'>
                      <button className='text-gray-500 action-button px-2 py-1 rounded hover:bg-gray-100'>...</button>
                      <div className='z-10 hidden absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button className='cursor-pointer block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                        <button className='cursor-pointer block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewApplications

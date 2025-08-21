// App.jsx
import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />

        {/* Dashboard parent route */}
        <Route path='/dashboard' element={<Dashboard />}>
          {companyToken ? (
            <>
              <Route index element={<ManageJobs />} /> {/* default page */}
              <Route path='add-job' element={<AddJob />} />
              <Route path='manage-jobs' element={<ManageJobs />} />
              <Route path='view-applications' element={<ViewApplications />} />
            </>
          ) : (
            <Route index element={<Navigate to='/' />} /> // redirect if no token
          )}
        </Route>

        {/* Catch-all redirect */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App

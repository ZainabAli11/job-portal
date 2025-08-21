import { useEffect, useState, createContext } from "react";
 import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react"

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchFilter, setSearchFilter] = useState({ title: '', location: '' });
    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplications] = useState([]);

    // Fetch jobs (dummy fallback)
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs');
            if (data.success) {
                setJobs(data.jobs);
                console.log(data.jobs);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    };

    //function to fetch user data
  //function to fetch user data
const fetchUserData = async () => {
    try {
        const token= await getToken();
        const {data} = await axios.get(backendUrl + '/api/users/user', {
            headers:{Authorization:`Bearer ${token}`}})
        if(data.success){
            setUserData(data.user);
        }else{
            toast.error(data.message);
        }
    }catch(error){
        toast.error(error.message);
    }
            
}


    // Fetch company data from backend
    const fetchCompanyData = async () => {
        if (!companyToken) return;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/company/company`,
                {},
                { headers: { token: companyToken } }
            );

            if (data.success) {
                setCompanyData(data.company);
                console.log("Company Data:", data.company);
            } else {
                toast.error(data.message || "Failed to fetch company data");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    //function to fetch user's applied applications data
    const fetchUserApplications = async () => {
        try {
          const token = await getToken();
          const { data } = await axios.get(backendUrl + '/api/users/applications', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setUserApplications(data.applications);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      };

    useEffect(() => {
        fetchJobs();
        const storedToken = localStorage.getItem('companyToken');
        if (storedToken) setCompanyToken(storedToken);
    }, []);

    useEffect(() => {
        if (companyToken) {
            localStorage.setItem('companyToken', companyToken);
            fetchCompanyData();
        } else {
            localStorage.removeItem('companyToken');
        }
    }, [companyToken]);
    useEffect(() => {
        
        if (user) {
            fetchUserData();
            fetchUserApplications();
        }
    },[user])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

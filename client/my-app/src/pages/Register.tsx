import React, { useState } from "react";
import axios, {AxiosError} from "axios";
import ConfettiExplosion from "../components/background";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import "../index.css"
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  lc_username?: string;
  cf_username?: string;
}

const RegisterPage: React.FC = () => {
  const base = "https://codeassist-q2nt.onrender.com"
  // const base = "http://127.0.0.1:5173"
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    lc_username: "",
    cf_username: "",
  });
  const [submitted, setSubmitted] = useState<Boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = toast.loading("Please Wait");
    try {
      if(formData.password.length < 8){
        toast.update(id, {render: "Minimum length of password must be 8", type: "error", isLoading: false, autoClose: 3000})
        return;
      }
      const response = await axios.post(`${base}/auth/signup`, formData)
      toast.update(id, {render: "Task successful", type: "success", isLoading: false, autoClose: 3000})
      setSubmitted(true)
      
      setTimeout(()=>{
        navigate('/login');
      }, 5000)
    } catch (error: unknown) {
      if(axios.isAxiosError(error)){
        console.log();
        toast.update(id, {render: error?.response?.data?.message || 'Something went wrong', type: "error", isLoading: false, autoClose: 3000})
      }
      else{
        toast.update(id, {render: 'Something went wrong', type: "error", isLoading: false, autoClose: 3000})
      }
    }
  };

  return (
    <div className="min-h-screen card-sharp flex flex-col justify-center items-center">
      {
        submitted && 
        <ConfettiExplosion/>
      }
      {/* <div className='bg-[#1e8296] absolute top-[8rem] -z-5 left-[-15rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[48.75rem]'></div> */}
      <div className="w-full max-w-md bg-transparent backdrop-blur-lg p-6 rounded-lg shadow-lg shadow-slate-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              LeetCode Username
            </label>
            <input
              type="text"
              name="lc_username"
              value={formData.lc_username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Codeforces Username
            </label>
            <input
              type="text"
              name="cf_username"
              value={formData.cf_username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-[#1e8296]/30 border-[1px] border-[#0e444e] rounded-md shadow-sm focus:outline-none text-slate-200"
              autoComplete="none"
            />
          </div>
          <div>
            <button
                type="submit"
                className="button"
            >
              <span>
                Register
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

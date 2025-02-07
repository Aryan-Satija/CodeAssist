import React, { useState } from "react";
import axios, {AxiosError} from "axios";
import ConfettiExplosion from "../components/background";
import { toast } from 'react-toastify';
import "../index.css"
import { useNavigate } from "react-router-dom";
interface FormData {
  email: string;
  password: string;
}
const LoginPage = () => {
  const navigate = useNavigate();
  const base = "https://codeassist-q2nt.onrender.com"
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
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
      axios.get(`https://codeassist-1-4r2r.onrender.com`);
      const response = await axios.post(`${base}/auth/login`, formData)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.update(id, {render: "Task successful", type: "success", isLoading: false, autoClose: 3000});
      setSubmitted(true);
      setTimeout(()=>{
        navigate("/echo");
      }, 5000);
    } catch (error: unknown) {
      if(axios.isAxiosError(error)){
        toast.update(id, {render: error?.response?.data?.message || 'Something went wrong', type: "error", isLoading: false, autoClose: 3000})
      }
      else{
        toast.update(id, {render: 'Something went wrong', type: "error", isLoading: false, autoClose: 3000})
      }
    }
  };

  return (
    <div className="relative">
      {/* <div className='bg-[#1e8296] absolute top-[8rem] -z-5 left-[-15rem] h-[15.25rem] w-[15.25rem] rounded-full blur-[10rem] sm:w-[48.75rem]'></div> */}
      <div className="h-screen card-sharp w-[100vw] flex flex-col justify-center items-center">
        {
          submitted && 
          <ConfettiExplosion/>
        }
        <div className="w-[320px] md:w-[448px] bg-transparent backdrop-blur-lg p-6 rounded-lg shadow-lg shadow-slate-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                  type="submit"
                  className="button"
              >
                <span className="">
                  Login
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {

  const {setToken} = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/admin/login', {email, password});
      
      if(data.success){
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success("Login successful!");
        
      }else{
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary/90">Admin</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 w-full sm:max-w-md text-gray-500">
            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={e => setEmail(e.target.value)} value={email}
                type="email"
                placeholder="your email here."
                className="border-b-2 border-gray-200 p-2 outline-none mb-6 "
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                onChange={e => setPassword(e.target.value)} value={password}
                type="password"
                placeholder="your password here."
                className="border-b-2 border-gray-200 p-2 outline-none mb-6 "
                required
              />
            </div>
            <button className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/80 transition-all" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
  
  const [form, setForm] = useState({name: "", email: "", password: ""});
  const { name, email, password } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post("https://db-talkingspace-backend.onrender.com/api/auth/signup", form,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup Successfull.", res.data);

      toast.success("Signup Successfull, Now login", {
        position: "top-center"
      });
      setForm({name: "", email: "", password: ""});
      
    }catch(err){
      console.error("Error from frontend Signup: ", err.response?.data);

      const errMessage = err.resposne?.data?.message || "";

      if(errMessage.toLowerCase().includes("already exist")){
        toast.error("User already exist! Please login", {
          position: "top-center"
        });
      }else{
        toast.error(errMessage || "Signup Failed",{
          position: "top-center"
        })
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>

        <ToastContainer />

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

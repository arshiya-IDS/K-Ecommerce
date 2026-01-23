import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import api from "../api/axiosInstance";


function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
 

  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");
  const email = query.get("email");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
     // setMessage("Reset token is missing.");
      Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Reset token is missing!",
});
      return;
    }

    if (!email) {
      //setMessage("Email is missing from the reset link. Please use the link sent to your email.");
      Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Email is missing from the reset link. Please use the link sent to your email.!",
});
      return;
    }

    if (password !== confirmPassword) {
      //setMessage("Passwords do not match!");

      Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Passwords do not match!",
});
      return;
    }

    try {

      const response = await api.post("/Auth/reset-password", {
        email,
        token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

     // setMessage("Password reset successful! Redirecting...");
       Swal.fire({
        title: "successfully!",
        text: "Password reset successful! Redirecting...",
        icon: "success"
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (err) {
      const serverMessage =
        err.response?.data?.message || "Invalid or expired token.";

      setMessage(serverMessage);
    }
  };

  


  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="card p-4 shadow" style={{ width: "500px" }}>
        <h3 className="text-center mb-3">Reset Password</h3>

      <form className="space-y-6 text-left" onSubmit={handleReset}>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#E5B5A1] transition dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
  

                <span
              className="absolute right-10 top-35 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          
                                                              
                </div>

             

                <div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#E5B5A1] transition dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
              className="absolute right-10 top-85 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
                
                </div>

               <button type="submit" className="w-full bg-[#a1d1e5] text-white py-3 rounded-md hover:bg-rose-300 transition">Reset Password</button>

              </form>


  
        {/* <form onSubmit={handleReset}>
          <label>New Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">Reset Password</button>
        </form> */}

        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;

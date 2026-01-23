import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import api from "../api/axiosInstance";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {

      const response = await api.post("/Auth/forgot-password", {

        email: email,
      });

     // setMessage("Reset link / OTP sent to your Email!");
       Swal.fire({
        title: "successfully!",
        text: "Reset link / OTP sent to your Email!",
        icon: "success"
      });
    } catch (err) {
      //setMessage("Email not found or server error.");
  Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Email not found or server error.!",
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="card p-4 shadow" style={{ width: "500px" }}>
        <h4 className="text-center mb-3">Forgot Password</h4>

           <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                 
                   <input
            type="email"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#E5B5A1] transition dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
                </div>
               
                <button className="w-full bg-[#a1d1e5] text-white py-3 rounded-md hover:bg-[#E5B5A1] transition" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
              </form>

        {/* <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form> */}

        {message && <p className="mt-3 text-center text-success">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;

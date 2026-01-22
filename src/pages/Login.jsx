import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import React, { useState, useEffect } from "react";


const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     const response = await axios.post(
//       "https://localhost:7013/api/Auth/login",
//       {
//         email: formData.email,
//         password: formData.password,
//       }
//     );

//     const data = response.data;
//     console.log("Login Success:", data);

//     // Store logged-in user
//     localStorage.setItem("user", JSON.stringify(data));

//     // Admin-only access
//     if (data.role && data.role.toLowerCase() === "admin") {
//       navigate("/dashboard");
//     } else {
//        Swal.fire({
//             icon: "error",
//             title: "Access Denied",
//             text: "Only Admin Can Access This Dashboard",
//           });
//     }
//   } catch (error) {
//     console.error("Login Error:", error);

//     if (error.response?.data) {
//       setError(error.response.data);
//     } else {
//       setError("Login failed. Please try again.");
//     }
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();
   setIsLoading(true); 
  setError("");

  try {
    const response = await axios.post(
      "https://localhost:7013/api/Auth/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    const data = response.data;


     if (rememberMe) {
      localStorage.setItem(
        "rememberedCredentials",
        JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      );
    } else {
      localStorage.removeItem("rememberedCredentials");
    }
    // Store auth info
    localStorage.setItem("auth", JSON.stringify({
      isLoggedIn: true,
      role: data.role,
      user: data
    }));

    if (data.role?.toLowerCase() === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Admin Can Access This Dashboard",
      });
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.response?.data || "Invalid email or password",
    });
  }
   finally {
    setIsLoading(false); 
  }
};

useEffect(() => {
  const savedCreds = JSON.parse(localStorage.getItem("rememberedCredentials"));

  if (savedCreds) {
    setFormData({
      email: savedCreds.email || "",
      password: savedCreds.password || ""
    });
    setRememberMe(true);
  }
}, []);


  return (
   <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light p-0"></nav>

      {/* Login Section */}
      <div
        className="container-fluid"
        style={{
          backgroundImage: "url(/images/login-bg.jpg)",
          height: "100vh",
          width: "100%",
          backgroundSize: "cover",
        }}
      >
        <div className="row">
          <div className="col-sm-3"></div>

          <div className="col-md-6 mt-5 ">
            <div className="login-section">
              <h2 className="text-center pt-4" style={{ fontWeight: "bold" }}>
                Login
              </h2>

              {/* <h6 className="login-w-icon text-center mt-4 mb-4">
                Login with Socials{" "}
              </h6>

              <div className="socials-icons mb-2 mt-4">
                <div className="iconss">
                  <a href="/">
                    <img src="/images/google.svg" alt="Google" />
                  </a>
                </div>

                <div className="iconss">
                  <a href="/">
                    <img src="/images/facebook.svg" alt="Facebook" />
                  </a>
                </div>

                <div className="iconss">
                  <a href="/">
                    <img src="/images/linkin.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div> */}

              <h6 className="login-w-icon text-center mt-4 mb-4 fs-6">
                 Login with Email{" "}
              </h6>

              <form onSubmit={handleSubmit} style={{ paddingBottom: "50px" , fontSize:'16px'}}>
                <div className="form-groups mb-2 fs-6">
                  <input
                    type="text"
                    className="form-controls"
                    placeholder="  User name,Email address,Mobile number"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-groups fs-6">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="form-controls"
                    placeholder="  Password"
                    id="inputPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <div className="hide-pass">
                    <img
                      src="/images/hide.svg"
                      className="hide-eye"
                      onClick={togglePassword}
                      id="inputPassword"
                      alt="Toggle Password Visibility"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>

                <div className="register-page-link d-flex justify-content-between px-5 align-items-center w-100 mt-4">
                  <div className="d-flex align-items-center">
                 
                   <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />

                  <label htmlFor="rememberMe" className="forgot mb-0">
                    Remember Me
                  </label>

                  </div>

                

                  {/* <a href="/" className="d-flex align-items-center text-decoration-none">
                    <p className="forgot mb-0" style={{ fontSize: '1.1rem',paddingRight:'1px' }}>Forgot Password?</p>
                  </a> */}
                </div>

                <div className="login-bt mt-4">
                  {/* <button
                    type="submit"
                    className="btn btn-forgot btn-lg btn-block"
                  >
                    Login
                  </button> */}

                  <button
                  type="submit"
                  className="btn btn-forgot btn-lg btn-block d-flex align-items-center justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                </div>
              </form>
            </div>
          </div>

          <div className="col-sm-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

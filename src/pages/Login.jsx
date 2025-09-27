import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", formData);
    // For now, redirect to dashboard after login
    navigate("/");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light p-0"></nav>

      {/* Login Section */}
      <div
        className="container-fluid"
        style={{
          backgroundImage: "url(/images/login-bg.webp)",
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

              <h6 className="login-w-icon text-center mt-4 mb-4">
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
              </div>

              <h6 className="login-w-icon text-center mt-4 mb-4 fs-6">
                Or Login with Email{" "}
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
                      value=""
                      id="flexCheckDefault"
                    />
                    <a href="/" className="d-flex align-items-center text-decoration-none">
                      <p className="forgot mb-0" style={{ fontSize: '1.1rem',paddingRight:'1px' }}>Remember Me</p>
                    </a>
                  </div>

                  <a href="/" className="d-flex align-items-center text-decoration-none">
                    <p className="forgot mb-0" style={{ fontSize: '1.1rem',paddingRight:'1px' }}>Forgot Password?</p>
                  </a>
                </div>

                <div className="login-bt mt-4">
                  <button
                    type="submit"
                    className="btn btn-forgot btn-lg btn-block"
                  >
                    Login
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

import React, { useState } from "react";
import { loginUser, registerUser } from "../../Auths/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auths/AuthLogic";
import "../../img/logo.png";
// import "./style.css";


const Admin = () => {
    const {login} = useAuth();
     const navigate = useNavigate();
  // State to toggle between login and register forms
  const [isLogin, setIsLogin] = useState(true);

  // Form data state
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Error message state
  const [error, setError] = useState("");

  // Password visibility toggle state (boolean)
  const [showPassword, setShowPassword] = useState(false);

  

  // Handle input changes and update form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (isLogin) {
      // Attempt login
      const res = await loginUser(form.email, form.password);
      if (res.success) {
        login(res.data.user, res.data.token);
        navigate("/"); // Redirect after successful login (adjust route if needed)
      } else {
        setError(res.message);
      }
    } else {
      // Attempt registration
      const res = await registerUser(form.name, form.email, form.password);
      if (res.success) {
        setIsLogin(true); // Switch to login form after successful registration
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-side">
        <form className="form-side" onSubmit={handleSubmit} aria-label={isLogin ? "Login form" : "Registration form"}>
          <h2>{isLogin ? "Login" : "Sign up"}</h2>

          {/* Show name input only on registration */}
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
              aria-label="Name"
            />
          )}

          {/* Email input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={form.email}
            onChange={handleChange}
            required
            aria-label="Email"
          />

          {/* Password input with toggle */}
        <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="input"
    value={form.password}
    onChange={handleChange}
    required
    aria-label="Password"
  />
  <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>


          {/* Submit button */}
          <button className="btn" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>

          {/* Display error message */}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          {/* Toggle between login and registration forms */}
          <p className="toggle-text">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="toggle-link" onClick={() => setIsLogin(false)} role="button" tabIndex={0} onKeyPress={() => setIsLogin(false)}>
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="toggle-link" onClick={() => setIsLogin(true)} role="button" tabIndex={0} onKeyPress={() => setIsLogin(true)}>
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>

      {/* You can uncomment and add your TruckAnimation here */}
      {/* <TruckAnimation /> */}
    </div>
  );
};

export default Admin;

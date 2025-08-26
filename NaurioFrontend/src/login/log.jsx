import React, { useState } from "react";
import { loginUser, registerUser } from "../Authentication/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthLogic";
import "../img/logo.png";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Toggle login/register form
  const [isLogin, setIsLogin] = useState(true);

  // Form state including confirmPassword for signup
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error message
  const [error, setError] = useState("");

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isLogin) {
      const res = await loginUser(form.email, form.password);
      if (res.success) {
        login(res.data.user, res.data.token);
        navigate("/");
      } else {
        setError(res.message);
      }
    } else {
      const res = await registerUser(form.name, form.email, form.password);
      if (res.success) {
        setIsLogin(true);
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-side">
        <form
          onSubmit={handleSubmit}
          aria-label={isLogin ? "Login form" : "Registration form"}
          noValidate
        >
          <h2>{isLogin ? "Login" : "Sign up"}</h2>

          {/* Name input only in signup */}
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                name="name"
                id="name"
                className="input"
                placeholder=" "
                value={form.name}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Name"
              />
              <label htmlFor="name" className="input-label">
                Name
              </label>
            </div>
          )}

          {/* Email input */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              id="email"
              className="input"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Email"
            />
            <label htmlFor="email" className="input-label">
              Email
            </label>
          </div>

          {/* Password input with toggle */}
          <div className="input-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="input"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Password"
              autoComplete="current-password"
            />
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password input (signup only) */}
          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input"
                placeholder=" "
                value={form.confirmPassword}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Confirm Password"
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
            </div>
          )}

          {/* Submit button */}
          <button className="btn" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Toggle between login and signup */}
          <p className="toggle-text">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setForm({ name: "", email: "", password: "", confirmPassword: "" });
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {
                    setIsLogin(false);
                    setError("");
                    setForm({ name: "", email: "", password: "", confirmPassword: "" });
                  }}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setForm({ name: "", email: "", password: "", confirmPassword: "" });
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {
                    setIsLogin(true);
                    setError("");
                    setForm({ name: "", email: "", password: "", confirmPassword: "" });
                  }}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

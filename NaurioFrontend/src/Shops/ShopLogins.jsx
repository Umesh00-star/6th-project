import React, { useState, useEffect } from "react";
import { loginShop, registerShop } from "../Auths/ShopAuth";
import { useNavigate } from "react-router-dom";
import { useShopAuth } from "../Auths/ShopAuthLogic";

import "../img/logo.png";
// import "./style.css";

const ShopLogins = () => {
    const {shop , shoplogin} = useShopAuth();
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
      const res = await loginShop(form.email, form.password);
      if (res.success) {
        console.log("Login success, navigating to /shop");
        shoplogin(res.data.shop, res.data.token);
        console.log("Shop login response:", res.data);

  //       setTimeout(() => {
    // navigate("/shop"); // This keeps you in /shop
  // }, 200); // Delay can be adjusted
        navigate("/shop"); // Redirect after successful login (adjust route if needed)
      } else {
        setError(res.message);
      }
    } else {
      // Attempt registration
      const res = await registerShop(form.name, form.email, form.password);
      if (res.success) {
        setIsLogin(true); // Switch to login form after successful registration
      } else {
        setError(res.message);
      }
    }
  };

   // Redirect to /shop after successful login
// useEffect(() => {
//   console.log("Current shop state:", shop);
//   if (shop) {
//     navigate("/shop");
//   }
// }, [shop, navigate]);


// useEffect(() => {
//   if (shop?.role === 'shop') {
//     navigate("/shop", { replace: true });
//   }
// }, [shop, navigate]);


  return (
    <div className="auth-wrapper">
      <div className="form-side">
        <form className="form-side" onSubmit={handleSubmit} aria-label={isLogin ? "Login form" : "Registration form"}>
          <h2>{isLogin ? "Shop-Login" : "Sign up"}</h2>

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

     
    </div>
  );
};

export default ShopLogins;

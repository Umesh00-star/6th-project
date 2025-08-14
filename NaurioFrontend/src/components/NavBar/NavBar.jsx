import React, { useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auths/AuthLogic';
import axios from "axios";
import cartlogo from '../../img/cart-logo.png';
import profilelogo from '../../img/profile-logo.png';

function NavBar() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch cart from backend
      axios.get(`http://localhost:8080/api/cart/${user.id}`)
        .then(res => {
          setCartCount(res.data.length); // Unique items
        })
        .catch(err => console.error("Cart fetch error", err));
    } else {
      // Load guest cart from sessionStorage
      const guestCart = sessionStorage.getItem("guest_cart");
      if (guestCart) {
        const parsed = JSON.parse(guestCart);
        setCartCount(parsed.length); // Count unique products
      } else {
        setCartCount(0);
      }
    }
  }, [isLoggedIn, user]);

  return (
    <nav className="navbar">
      <Link to ="/"
      // >
      // <div
       className="navbar-logo"  style={{ textDecoration: 'none' }}>
        <div className="logo-circle">
          <img src={logo} alt="Naurio Ecommerce Logo" />
        </div>
        <h1 className="navbar-title">
          <span className="multi-color">N</span>
          <span className="multi-color">A</span>
          <span className="multi-color">U</span>
          <span className="multi-color">R</span>
          <span className="multi-color">I</span>
          <span className="multi-color">O</span>{' '}
          <span className="ecommerce-title">Ecommerce</span>
        </h1>
        </Link>
      {/* </div> */}





      <ul className="navbar-menu">
        {/* Home */}
        <li><Link to="/">Home</Link></li>

        {/* Normal user menu */}
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/age-filter">Shop by Age</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/orders">Orders</Link></li>

        {/* Cart */}
        <li className="cart-icon">
          <Link to="/cart">
            <img src={cartlogo} alt="Cart" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{ fontSize: "0.75rem" }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </li>

        {/* Auth */}
        {user ? (
          <li className="profile_menu">
            <img
              src={profilelogo}
              alt="Profile"
              className="profile_icon"
            />
            <div className="dropdown" role="menu">
              <p><strong>{user.name}</strong></p>
              <ul>
                <li>
                  <Link to="/settings" className="setting">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link to="/" className="logout" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login" className="signin-button">
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;

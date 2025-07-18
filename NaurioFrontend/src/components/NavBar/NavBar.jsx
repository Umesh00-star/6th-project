import React, {useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auths/AuthLogic';
import axios from "axios";
import Profile from '../Profiles/Profile';
import cartlogo from '../../img/cart-logo.png';
import profilelogo from '../../img/profile-logo.png';
import Cart from '../../ShowProduct/Carts';
import OrdersPage from '../../Orders/OrderPage';
import Contact from "../Contactus/Contact";


function NavBar() {
  const { user, logout, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
   const [cartCount, setCartCount] = useState(0);

    const isLoggedIn = user && user.role !== "shop";

//  if (loading) return null;
  const toggleDropdown = () => 
    // setShowDropdown(!showDropdown);
    setShowDropdown((prev) => !prev);
  

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };


  // Don't render navbar while loading user
  // if (loading) {
  //   return (
  //     <nav className="navbar">
  //       <div className="navbar-logo">
  //         <span>Loading...</span>
  //       </div>
  //     </nav>
  //   );
  // }

    
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



  // Choose Home label depending on user role
  const homeLabel = user?.role === 'shop' ? 'Shop Home' : 'Home';

  return (
    <nav className="navbar" 
    // role="navigation" aria-label="Main Navigation"
    >
      <div className="navbar-logo">
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
          <span className="ecommerce-title">
            {user?.role === 'shop' ? 'Shop Dashboard' : 'Ecommerce'}
          </span>
        </h1>
      </div>

      <ul className="navbar-menu">
        {/* Home link to "/" for all users */}
        <li><Link to="/">{homeLabel}</Link></li>

        {/* Show additional menu only for non-shop or guest users */}
        {(!user || user.role !== 'shop') && (
          <>
            <li><Link to="/Categories">Categories</Link></li>
            <li><Link to="/AgeFilter">Shop by Age</Link></li>
         
        

        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/orders">Order</Link></li>
         
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
           </>
        )}


        {user?.role === 'shop' && (
  <li>
    <Link to="/product">Upload Product</Link>
  </li>
)}
          {/* <li><img src={logo} alt="Naurio Ecommerce Logo" /></li> */}
           
           {/* <div className="Profile-container"> */}
            
        {/* Authenticated User Menu */}
        {user ? (
          <li className="profile_menu">
            <span
              onClick={toggleDropdown}
              className="profile_name"
              // tabIndex={2}
              role="button"
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
             
               {/* <img
      src={user?.profileImage || '/default-profile.png'} // fallback image
      alt="Profile"
      className="profile_icon"
    /> */}
             <img
                src={profilelogo}
                alt="Profile"
                className="profile_icon"
              />
            </span>

            {showDropdown && (
              <div className="dropdown" role="menu">
                <p><strong>{user.name}</strong></p>
                <ul>
                  <li>
                    <Link to="/Settings" className="setting">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/Login" className="signin-button">
              Sign In
            </Link>
          </li>
        )}
        
        {/* </div> */}
      </ul>
    </nav>
  );
}

export default NavBar;

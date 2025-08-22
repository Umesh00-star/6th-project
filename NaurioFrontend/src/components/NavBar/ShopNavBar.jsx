// src/components/Shop/ShopNavBar.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShopAuth } from "../../Authentication/ShopAuthLogic";
import ProductUpload from "../Products/ProductUpload";

const ShopNavBar = () => {
  const { shop, logout } = useShopAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/shop/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        
      {/* </div>
      <div> */}
      <h1 className="navbar-title">
          <span className="multi-color">N</span>
          <span className="multi-color">A</span>
          <span className="multi-color">U</span>
          <span className="multi-color">R</span>
          <span className="multi-color">I</span>
          <span className="multi-color">O</span>{' '}
          <span className="ecommerce-title">Ecommerce</span>
        </h1>
      </div>
      <Link to="/shop/dashboard" style={styles.link}>
          🛍️ Shop Panel
        </Link>

      <div style={styles.links}>
        <Link to="/shop/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/shop/shops" style={styles.link}>My Products</Link>
        <Link to="/shop/upload" style={styles.link}>Upload Product</Link>

        {shop && (
          <>
            <span style={styles.shopName}>Hello, {shop.name}</span>
            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </>
        )}
      </div>
      
            
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#242424",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  shopName: {
    fontStyle: "italic",
    color: "#ccc",
  },
  logout: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default ShopNavBar;

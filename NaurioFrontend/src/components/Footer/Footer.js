import React from 'react';
import './Footer.css';
import footerLogo from '../../img/footer-logo.png'; // Replace with your image path or remove if none

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo on left (optional) */}
        <div className="footer-logo">
          <img src={footerLogo} alt="NaurioTech Studio Logo" />
        </div>
        
        {/* Text on right */}
        <div className="footer-text">
          <p>© 2025 NaurioEcommerce. All rights reserved.</p>
          <p>Developed and Designed by NaurioTech Studio.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

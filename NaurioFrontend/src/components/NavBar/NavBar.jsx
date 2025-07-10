import React,{useState} from 'react';
import logo from '../../img/logo.png';
import './NavBar.css';
import Login from '../../login/Login';
import ReactDOM from 'react-dom/client';
import { Link  } from 'react-router-dom';
import { useAuth } from '../../Auths/AuthLogic';



function NavBar() {

  const {user, logout} = useAuth(); // provide access to user and logout
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };
  
  
  return (
    <nav className="navbar">
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
          <span className="ecommerce-title">Ecommerce</span>
        </h1>
      </div>

      <ul className="navbar-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#categories">Categories</a></li>
        <li><a href="#age-filter">Shop by Age</a></li>
        <li><a href="#contact">Contact</a></li>
        {/* <li><a href="/login">Sign In</a></li> */}
        {/* <li><Link to="/Login" className="signin-button">Sign In</Link></li> */}
        {user ? (
        //   <>
        //   <li><span>Hello,{user.name}</span></li>
        //  <li><button onClick={logout} className='logout-button'></button></li>
        //  </>

        <li className="profile-menu">
          <span onClick={toggleDropdown} classname="profile-name">
            {user.name}
          </span>

          {showDropdown && (
            <div className="dropdown">
              <p><strong>Full Name:</strong>{user.name}</p>
           {/*<p> Email: {user.email}</p> */}
           <button onClick={() => alert('Settings')}>Settings</button>
           <button onClick={handleLogout}>Logout</button>
            </div>
          )}

        </li>

        ): (
          <li><Link to ="/Login" className="signin-button">Sign In</Link></li>
        )}
      
      </ul>
      
    </nav>
  );
}




export default NavBar;

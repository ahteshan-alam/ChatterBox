import React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ name,  onUser}) => {
    const navigate=useNavigate()
  const handleHome = () => {
   navigate("/")
  };

  const handleUser = () => {
    console.log('User button clicked');
    if (onUser) onUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
   navigate("/login")
  };

 

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="navbar-left">
          <div className="app-logo">C</div>
          <div className="app-name">ChatterBoxx</div>
        </div>

        
        <div className="navbar-right">
          <button className="nav-btn home-btn" onClick={handleHome}>
            <span>Home</span>
          </button>
          <button className="nav-btn user-btn" onClick={handleUser}>
            <div className="user-icon"><i class="fa-solid fa-user"></i></div>
            <span>{name || "Guest"}</span>
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
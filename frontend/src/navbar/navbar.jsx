import React, { useState, useEffect } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ name, onUser }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false); // Close menu on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleHome = () => {
    navigate('/');
    if (isMobile) setIsMobileMenuOpen(false); // Close menu after action
  };

  const handleUser = () => {
    console.log('User button clicked');
    if (onUser) onUser();
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Click outside to close (optional enhancement)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        closeMobileMenu();
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Existing desktop navbar-right JSX (unchanged)
  const desktopNavRight = (
    <div className="navbar-right">
      <button className="nav-btn home-btn" onClick={handleHome}>
        <span>Home</span>
      </button>
      <button className="nav-btn user-btn" onClick={handleUser}>
        <div className="user-icon"><i className="fa-solid fa-user"></i></div>
        <span>{name || "Guest"}</span>
      </button>
      <button className="nav-btn logout-btn" onClick={handleLogout}>
        <span>Logout</span>
      </button>
    </div>
  );

  // Separate dropdown JSX for mobile
  const mobileDropdown = (
    <div className="navbar-right">
      <div className="mobile-menu-container">
        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
        {isMobileMenuOpen && (
          <div className="mobile-dropdown">
            <button className="nav-btn home-btn" onClick={handleHome}>
              <span>Home</span>
            </button>
            <button className="nav-btn user-btn" onClick={handleUser}>
              <div className="user-icon">
                <i className="fa-solid fa-user"></i>
              </div>
              <span>{name || "Guest"}</span>
            </button>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="app-logo">C</div>
          <div className="app-name">ChatterBoxx</div>
        </div>
        {isMobile ? mobileDropdown : desktopNavRight}
      </div>
    </nav>
  );
};

export default Navbar;
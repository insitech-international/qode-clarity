import React from "react";
import { Link } from "react-router-dom";
import "./../../styles/Header.css"; // Add CSS for styling

const Header = () => {
  return (
    <header className="header">
      <div className="brand">
        <h1>Python Query Vault</h1>
      </div>
      <nav className="header-nav">
        <Link to="#">About Us</Link>
        <Link to="#">Contact Us</Link>

        {/* <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link> */}
      </nav>
    </header>
  );
};

export default Header;

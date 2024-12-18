import React from "react";
import logo from "../assets/Movie.png"; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="MovieFiesta Logo" className="logo" />
        <h1 className="brand-name">MOVIE-FIESTA</h1>
      </div>
    </header>
  );
};

export default Header;

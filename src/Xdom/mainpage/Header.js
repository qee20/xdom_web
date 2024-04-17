import React from 'react';
import Logo from "../Resources/logo.png";

function Header() {
  return (
    <header className="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow" style={{backgroundColor : '#E1F7F5'}}>
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
        <img width={80} src={Logo} alt="Company logo"/>
      </a>
    </header>
  );
}

export default Header;
import React from 'react';
import NavLink from './NavItem';

import './NavBar.css';

function NavBar() {
  return (
    <div className="Header">
        <a className="Title" href="/">PearScale</a>

        <nav className="NavBar">
            <ul className="NavList">
                <NavLink 
                    value="Slices"
                    link="www.google.com"
                />
                <NavLink 
                    value="Login"
                    link="www.google.com"
                />
                <NavLink 
                    value="Swag button"
                    link="www.google.com"
                />
            </ul>
        </nav>
    </div>
  )
}

export default NavBar
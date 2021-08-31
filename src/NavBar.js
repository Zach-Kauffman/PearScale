import React from 'react';
import NavItem from './NavItem';

import './NavBar.css';

function NavBar() {
  return (
    <div className="Header">
        <a className="Title" href="/">PearScale</a>

        <nav className="NavBar">
            <ul className="NavList">
                <NavItem 
                    value="Slices"
                    link="slices/someSliceID"
                />
                <NavItem 
                    value="Login"
                    link="auth0/auth0Endpoint"
                />
                <NavItem 
                    value="User Profile"
                    link="User"
                />
            </ul>
        </nav>
    </div>
  )
}

export default NavBar
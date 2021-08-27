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
                    link="slices/someSliceID"
                />
                <NavLink 
                    value="Login"
                    link="auth0/auth0Endpoint"
                />
                <NavLink 
                    value="User Profile"
                    link="users/someUserID"
                />
            </ul>
        </nav>
    </div>
  )
}

export default NavBar
import React from 'react';
import NavItem from './NavItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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

                    <li className="Search">
                        <input type="text" id="SearchInput" placeholder="Find the pearfect pear..." />
                        <button type="button" id="SearchButton"><a href="#"></a><FontAwesomeIcon icon={faSearch} /></button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar
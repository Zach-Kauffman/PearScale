import React from 'react';
import NavItem from './NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './NavBar.css';
import LoginButton from './auth/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './auth/LogoutButton';
import ProfileButton from './auth/ProfileButton';


function NavBar() {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();


    return (
        <div className="Header">
            <a className="Title" href="/">PearScale</a>
            <nav className="NavBar">
                <ul className="NavList">
                    <NavItem
                        value="Slices"
                        link="slices/someSliceID"
                    />
                    <LoginButton/>
                    <LogoutButton/>
                    <ProfileButton/>
                    <li className="Search">
                        <input type="text" id="SearchInput" placeholder="Find the pearfect pear..." />
                        <button type="button" id="SearchButton"><a href="#"></a><FontAwesomeIcon icon={faSearch} /></button>
                    </li>
                </ul>
            </nav>
        </div>
    );

}

export default NavBar
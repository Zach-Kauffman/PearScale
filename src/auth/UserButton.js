import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

function UserButton() {
  const {
    isAuthenticated,
    user,
  } = useAuth0();

  console.log(user);

  return isAuthenticated && (
    <li className="NavItem">
        <Link to="/Account" className="NavLink" >Account</Link>
    </li>
  );
}

export default UserButton;
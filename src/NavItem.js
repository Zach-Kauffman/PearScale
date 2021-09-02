import React from 'react';
import { Link } from 'react-router-dom';


import './NavItem.css';

function NavItem(props) {
  return (
    <li className="NavItem">
        <Link to={props.link} className="NavLink" >{props.value}</Link> 
    </li>
  )
}

export default NavItem
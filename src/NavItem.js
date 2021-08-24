import React from 'react';

import './NavItem.css';

function NavItem(props) {
  return (
    <li className="NavItem">
        <a className="NavLink" href={props.link}>{props.value}</a> 
    </li>
  )
}

export default NavItem
import React  from 'react';

import './Button.css';

function Button(props) {
    return (
        <button className="Button" onClick={props.onClick}>
            <img id="ButtonIcon" src={props.icon}/>
        </button>
    );
}

export default Button;



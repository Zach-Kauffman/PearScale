import React  from 'react';

import './Pear.css';

function Pear(props) {
    return (
        <article className="Pear">
            <a className="PearImageContainer">
                <img className="PearImage" 
                    src={props.image} 
                    title={props.description}>
                </img>
            </a>
            <div className="PearContent">
                <p className="PearTitle">
                    {props.title}
                </p>
                <p className="PearAuthor">
                    <a href={"/users/" + props.user }>{props.user}</a>
                </p>
                <p className="PearRating">
                    15/15
                </p>
            </div>
        </article>
    );
}

export default Pear;



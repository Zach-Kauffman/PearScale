import React  from 'react';
import { Link } from 'react-router-dom';

import './Pear.css';

class Pear extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            title: props.title,
            description: props.description,
            user: props.user,
            image: props.image,
            slice: props.slice
        }
    }

    render() {
        return (
            <article className="Pear">
                <Link className="PearImageContainer" 
                    to={"Slice/" + this.state.slice + "/" + this.state.id}>
                    <img className="PearImage" 
                        src={this.state.image} 
                        title={this.state.description}>
                    </img>
                </Link>
                <div className="PearContent">
                    <p className="PearTitle">
                        {this.state.title}
                    </p>
                    <p className="PearAuthor">
                        <a href={"User/" + this.state.user }>{this.state.user}</a>
                    </p>
                    <p className="PearRating">
                        15/15
                    </p>
                </div>
            </article>
        );
    }
}

export default Pear;



import React from 'react';
import { Link } from 'react-router-dom';

import './BigPear.css';

class BigPear extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            description: null,
            user: null,
            image: null,
        };
    }

    async componentDidMount() {
        const pearLocation = window.location.pathname.slice(7);
        let url = "http://localhost:8000/slices/" + pearLocation;

        const response = await fetch(url);
        const pear = await response.json();

        let image;
        url = "http://localhost:8000/media/" + pear._id;

        await fetch(url).then(response => response.blob()).then(blob => {
            const objectURL = URL.createObjectURL(blob);
            image = objectURL;
        });

        this.setState({
            title:pear.metadata.title,
            description:pear.metadata.description,
            user:pear.metadata.user,
            image:image
        });
    }


    render() {

        return(
            <div className="BigPear">
                <div className="BigPearImageContainer">
                    <img className="BigPearImage" src={this.state.image} title={this.state.description}></img>
                </div>

                <div className="BigPearInfo">
                    <h2 className="BigPearTitle">
                        {this.state.title}
                    </h2>
                    <p className="BigPearDescription">
                        {this.state.description}
                    </p>
                    <p className="BigPearUser">
                        Posted by 
                        <Link to={"User/" + this.state.user}>{this.state.user}</Link>
                    </p>

                    <div className="BigPearRating">
                        Rated an average of  
                        <p className="BigPearRatingValue">420/15</p>
                         by 
                        <p className="BigPearRatingValue">69</p>
                         users
                    </div>

                    <div className="BigPearButtonsContainer">
                        NONE OF THESE BUTTONS DO ANYTHING YET
                        <button class="BigPearButton" id="BigPearRate">
                            Rate
                        </button>
                        <button class="BigPearButton" id="BigPearDelete">
                            Delete
                        </button>
                        <button class="BigPearButton" id="BigPearReport">
                            Report
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default BigPear;
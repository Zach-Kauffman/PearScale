import React from 'react'; 

import './User.css';

class User extends React.Component {

    constructor(props) {
        super(props);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    getUserPears() {
        //TODO

    }

    render() {
        const hasPears = this.getRandomInt(0,2);
        return(
            <div className = "UserContainer" >
                <h1 className="UserGreeting">
                    welcome to the home of
                    <p className="Username">
                        RANDOM USER
                    </p>
                </h1>

                <div className="PearContainer">
                    <h2>
                        {
                            hasPears ? "This user hasn't posted any pears yet :(" : "RANDOM USER'S pears:"
                        }
                    </h2>
                    {this.getUserPears()}
                </div>
            </div>
        );
    }
        
}

export default User;
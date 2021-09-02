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
        const isCurrentUser = this.getRandomInt(0,2);
        const hasPears = this.getRandomInt(0,2);
        return(
            <div className = "UserContainer" >
                <h1 className="UserGreeting">
                    welcome {isCurrentUser ? "to the home of " : "home "}
                    <p className="Username">
                        {isCurrentUser ? "RANDOM USER " : "ACTIVE USER "}
                    </p>
                </h1>

                <div className="PearContainer">
                    <h2>
                        {
                            isCurrentUser ? 
                                (hasPears ? "This user hasn't posted any pears yet :(" : "RANDOM USER'S pears:") :
                                (hasPears ? "You haven't posted any pears yet :(" : "Your pears:")      
                        }
                    </h2>
                    {this.getUserPears()}
                </div>
            </div>
        );
    }
        
}

export default User;
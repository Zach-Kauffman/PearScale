import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import './User.css';

const Profile = () => {
    const {user, isAuthenticated} = useAuth0();
    const hasPears =  Math.floor(Math.random() * 2);

    return isAuthenticated && (
        <div className="UserContainer" >
            <h1 className="UserGreeting">
                welcome home
                <p className="Username">
                    {user.name}
                </p>
            </h1>

            <div className="PearContainer">
                <h2>
                    {
                        hasPears ? "You haven't posted any pears yet :(" : "Your pears:"
                    }
                </h2>
            </div>
        </div>
    );

}

export default Profile;
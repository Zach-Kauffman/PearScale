require('dotenv').config();

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Auth0Provider } from "@auth0/auth0-react";

import App from './App';
import User from './User';
import Profile from './Profile';
import NavBar from './NavBar';
import BigPear from './BigPear';

const history = createBrowserHistory();

ReactDOM.render(
    <Auth0Provider
        domain="pearscale.us.auth0.com"
        clientId="TQoBYWHns8pKIx9eUet0VwerVy6bLpX4"
        redirectUri={window.location.origin}
        >
        <Router history={history}>
            <NavBar />
            <Switch>
                <Route path="/User">
                    <User />
                </Route>
                <Route path="/Profile">
                    <Profile />
                </Route>
                <Route path="/Slice">
                    <BigPear />
                </Route>
                <Route path="/">
                    <App />
                </Route>
            </Switch>
        </Router>
    </Auth0Provider>,
    document.getElementById('root')
);
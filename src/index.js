import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from './App';
import User from './User';
import NavBar from './NavBar';
import BigPear from './BigPear';

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <NavBar />
        <Switch>
            <Route path="/User">
                <User />
            </Route>
            <Route path="/Slice">
                <BigPear />
            </Route>
            <Route path="/">
                <App />
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root')  
);
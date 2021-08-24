import React  from 'react';
import NavBar from './NavBar';

import './App.css';
import Button from './Button';

function App() {
    return (
        <div className="App">
            <NavBar />
            <Button 
                icon="https://freeiconshop.com/wp-content/uploads/edd/pear-outline.png"
            />
        </div>
    );
}

export default App;



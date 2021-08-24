import React  from 'react';
import NavBar from './NavBar';

import './App.css';
import Button from './Button';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pearButtonPressed: false,
        };
    }

    handlePearButtonClick() {
        this.setState({pearButtonPressed: !this.state.pearButtonPressed})
        let status = this.state.pearButtonPressed ? "is" : "is not";
        console.log("Pear button " + status + " pressed.");
    }

    render() {
        return (
            <div className="App">
                <NavBar />
                <Button 
                    icon="https://freeiconshop.com/wp-content/uploads/edd/pear-outline.png"
                    onClick={() => this.handlePearButtonClick()}
                />
            </div>
        );
    } 
}

export default App;



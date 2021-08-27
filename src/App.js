import React  from 'react';
import NavBar from './NavBar';
import Modal from './Modal';
import Button from './Button';

import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pearButtonPressed: false,
        };
    }

    handlePearButtonClick() {
        this.setState({pearButtonPressed: !this.state.pearButtonPressed})
        let status = this.state.pearButtonPressed ? " not" : "";
        console.log("Pear button is" + status + " pressed.");
    }

    handlePearModalCancel() {
        console.log("Cancel");
        this.handlePearButtonClick();
    }

    handlePearModalAccept() {
        console.log("Accept");
        //TODO: add POST endpoint
    }

    renderPearModal() {
        if(this.state.pearButtonPressed) {
            return (
                <Modal 
                    title="Post a Pear"
                    handleCancel={() => this.handlePearModalCancel()}
                    handleAccept={() => this.handlePearModalAccept()}
                />
            );
        } else {
            return;
        }
    }

    render() {
        return (
            <div className="App">
                <NavBar />
                <Button 
                    icon="https://freeiconshop.com/wp-content/uploads/edd/pear-outline.png"
                    onClick={() => this.handlePearButtonClick()}
                />
                {this.renderPearModal()}
            </div>
        );
    } 
}

export default App;



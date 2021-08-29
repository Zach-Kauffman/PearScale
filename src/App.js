import React  from 'react';
import NavBar from './NavBar';
import Modal from './Modal';
import Button from './Button';
import Pear from './Pear';

import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pearButtonPressed: false,
            pears: [],
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
        const pears = this.state.pears.slice();
        pears.push({
            title: "Cool Pear",
            description: "This is a very cool pear",
            user: "Cool Guy",
            image: "https://www.gisymbol.com/wp-content/webp-express/webp-images/uploads/2017/08/Australian-Pears-600x600.png.webp"
        });
        this.setState({
            pears: pears,
            pearButtonPressed: false,
        });
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

    renderPears() {
        let toReturn = [];
        for(let i = 0; i < this.state.pears.length; i ++) {
            toReturn.unshift(
            <div key={i}>
                <Pear 
                    title={this.state.pears[i].title + " #" + (i + 1)}
                    description={this.state.pears[i].description}
                    user={this.state.pears[i].user}
                    image={this.state.pears[i].image}
                />
            </div>);
        }
        return toReturn;
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
                <div className="PearContainer">
                    {this.renderPears()}
                </div>
            </div>
        );
    } 
}

export default App;



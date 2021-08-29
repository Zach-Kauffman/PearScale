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

    async componentDidMount() {
        const url = "http://localhost:8000/slices/Ripe";
        const response = await fetch(url);
        const pearDB = await response.json();
        const pears = this.state.pears.slice();
        
        for(let i = 0; i < pearDB.pears.length; i ++) {
            let url = "http://localhost:8000/media/" + pearDB.pears[i]._id;
            let image;
            await fetch(url).then(response => response.blob()).then(blob => {
                const objectURL = URL.createObjectURL(blob);
                image = objectURL;
            });
            pears.push({
                title: pearDB.pears[i].metadata.title,
                description: pearDB.pears[i].metadata.description,
                user: "Cool Guy",
                image: image
            });
        }

        this.setState({
            pears: pears
        });
    }

    handlePearButtonClick() {
        this.setState({pearButtonPressed: !this.state.pearButtonPressed})
        let status = this.state.pearButtonPressed ? " not" : "";
        console.log("Pear button is" + status + " pressed.");
    }

    handlePearModalClose() {
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
                    handleClose={() => this.handlePearModalClose()}
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
                    title={this.state.pears[i].title}
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



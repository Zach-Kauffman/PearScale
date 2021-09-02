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

    //when homepage is loaded, do this stuff
    async componentDidMount() {
        //fetches a list of all pears from the Ripe slice
        const url = "http://localhost:8000/slices/Ripe";
        const response = await fetch(url);
        const pearDB = await response.json();
        const pears = this.state.pears.slice();
        
        //has to get the image for each pear individually
        //TODO: make a new endpoint which returns all images for all pears in a given slice
        //this avoids doing numerous API calls every time we load the homepage
        for(let i = 0; i < pearDB.pears.length; i ++) {
            let url = "http://localhost:8000/media/" + pearDB.pears[i]._id;
            console.log(pearDB.pears[i]._id);
            let image;
            await fetch(url).then(response => response.blob()).then(blob => {
                const objectURL = URL.createObjectURL(blob);
                image = objectURL;
            });
            pears.push({
                id: pearDB.pears[i]._id,
                title: pearDB.pears[i].metadata.title,
                description: pearDB.pears[i].metadata.description,
                user: "Cool Guy",
                image: image,
                slice: pearDB.pears[i].metadata.slice
            });
        }

        //updates the state with all the pears we just got from the database
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

    renderPearModal() {
        if(this.state.pearButtonPressed) {
            return (
                <Modal 
                    title="Post a Pear"
                    handleClose={() => this.handlePearModalClose()}   
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
                    id={this.state.pears[i].id}
                    title={this.state.pears[i].title}
                    description={this.state.pears[i].description}
                    user={this.state.pears[i].user}
                    image={this.state.pears[i].image}
                    slice={this.state.pears[i].slice}
                />
            </div>);
        }
        return toReturn;
    }

    render() {
        return (
            <div className="App">
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



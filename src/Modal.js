import React from 'react';

import './Modal.css';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            nsfw: false
        }

        this.fileInput = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if(!this.fileInput.current.files[0]) {
            alert("All pears require an image before posting");
        } else {
            const url = "http://localhost:8000/slices/Big";

            const file = this.fileInput.current.files[0];
            const data = {
                title: this.state.title,
                description: this.state.description,
                nsfw: this.state.nsfw,
                image: file
            };
            const response = await fetch( url, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(data)
            }); 

            console.log(response);

            this.props.handleClose();
        }
    }

    render() {
        return (
            <div className="Modal">
                <div className="ModalHeader">
                    <h3 className="ModalTitle">{this.props.title}</h3>
                    <button type="button" className="ModalCloseButton"
                        onClick={this.props.handleClose}>&times;
                    </button>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="ModalBody">
                        <label className="ModalBodyInput">
                            Title
                            <input
                                name="title"
                                type="text"
                                value={this.state.title}
                                onChange={this.handleInputChange} />
                        </label>
                        <br />
                        <label className="ModalBodyInput">
                            Image
                            <input
                                type="file"
                                ref={this.fileInput} />
                        </label>
                        <br />

                        <label className="ModalBodyInput">
                            Description
                            <textarea
                                name="description"
                                type="text"
                                value={this.state.description}
                                onChange={this.handleInputChange} />
                        </label>

                        <label className="ModalBodyInput">
                            NSFW
                            <input
                                name="nsfw"
                                type="checkbox"
                                checked={this.state.nsfw}
                                onChange={this.handleInputChange} />
                        </label>

                    </div>

                    <div className="ModalFooter">
                        <button type="button" className="ModalCancelButton"
                            onClick={this.props.handleClose}>Cancel
                        </button>
                        <input className="ModalAcceptButton" type="submit" value="Submit" />
                    </div>
                </form>
            </div>

        );
    }
}

export default Modal;


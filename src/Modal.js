import React from 'react';

import './Modal.css';

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    // TODO
    // renderModalBody() {
    //     let Body = [];
    //     for(let i = 0; i < this.props.body.length; i ++) {
    //         Body.push(
    //             <div className="ModalBodyInput">
    //                 <label>this.props.body[i]</label>
    //             </div>
    //         );
    //     }
    // }

    render() {
        return (
                <div className="Modal">
                    <div className="ModalHeader">
                        <h3 className="ModalTitle">{this.props.title}</h3>
                        <button type="button" className="ModalCloseButton" 
                            onClick={this.props.handleCancel}>&times;
                        </button>
                    </div>

                    <div className="ModalBody">

                        <div className="ModalBodyInput">
                            <label for="PearTitleInput">Title</label>
                            <input type="text" id="PearTitleInput"></input>
                        </div>

                        <div className="ModalBodyInput">
                            <label for="PearImageInput">Image</label>
                            <input type="file" id="PearImageInput"></input>
                        </div>

                        <div className="ModalBodyInput">
                            <label for="PearDescriptionInput">Description</label>
                            <textarea id="PearDescriptionInput" placeholder="Optional"></textarea>
                        </div>

                    </div>

                    <div className="ModalFooter">
                        <button type="button" className="ModalCancelButton" 
                            onClick={this.props.handleCancel}>Cancel
                        </button>
                        <button type="button" className="ModalAcceptButton" 
                            onClick={this.props.handleAccept}>Accept
                        </button>
                    </div>
                </div>

        );
    }
}

export default Modal;



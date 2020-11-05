import React, { Component } from "react";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from "mdbreact";
import { Sets } from "../Sets";

export default class Modal extends Component {
  render() {
    const { modalId, modal, toggle, move, texttolearn } = this.props;

    return (
      <>
        {modal ? (
          <MDBModal isOpen={modal} toggle={toggle} backdrop={true} size="lg" full-height position="left">
            <MDBModalHeader toggle={this.props.toggle}>{Sets[modalId].title}</MDBModalHeader>
            <MDBModalBody>{Sets[modalId].song}</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="success"
                outline
                onClick={() => {
                  if (move !== false) {
                    move();
                  }
                  toggle();
                  texttolearn(Sets[modalId].song);
                }}
              >
                Learn It!
              </MDBBtn>
              <MDBBtn color="black" outline onClick={toggle}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        ) : null}
      </>
    );
  }
}

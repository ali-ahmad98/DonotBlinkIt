import React from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { Link } from "react-router-dom";

export default class Footer extends React.Component {
  render() {
    return (
      <div
        className="content"
        style={{
          background: "#333333",
          padding: "5% 0",
          position: "absolute",
          left: 0,
          right: 0,
          color: "white",
          zIndex: 9999,
        }}
      >
        <MDBContainer>
          <MDBRow>
            <MDBCol sm={12} md={6} lg={4} style={{ textAlign: "center" }}>
              {/* <img src={require('../../assets/icons/logo2.png')} style={{width: '20%'}} /> */}
              {/* <br /> */}
              <h3>Do Not Blink</h3>
              <p>Train your focus and memory. Support the project here.</p>
            </MDBCol>
            <MDBCol sm={12} md={6} lg={4} style={{ textAlign: "center" }}>
              <h4>Other projects</h4>
              <hr />
              <p>
                <span style={{ marginTop: 10 }}>
                  <i className=""></i> themessage.app
                </span>{" "}
                <br />
                <span style={{ marginTop: 10 }}>
                  <i className=""></i> go.learncraft.pl
                </span>{" "}
                <br />
              </p>
            </MDBCol>
            <MDBCol sm={12} md={12} lg={4} style={{ textAlign: "center" }}>
              <h4>Tell me what you think:</h4>
              <hr />
              <MDBRow sm={12} md={12} lg={12}>
                <MDBCol size = "4" sm={4} md={4} lg={4} style = {{display : "inline"}}>
                  <Link
                    to="https://www.facebook.com/pshemek.skw"
                    className="social_btn"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </MDBCol>
                <MDBCol size = "4" sm={4} md={4} lg={4} style = {{display : "inline"}}>
                  <Link
                    to="https://twitter.com/says_przemek"
                    className="social_btn"
                  >
                    <i className="fab fa-twitter"></i>
                  </Link>
                </MDBCol>
                <MDBCol size = "4" sm={4} md={4} lg={4} style = {{display : "inline"}}>
                  <Link
                    to="https://www.instagram.com/one.at.the.time/"
                    className="social_btn"
                  >
                    <i className="fab fa-instagram"></i>
                  </Link>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

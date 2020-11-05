import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBSideNav,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavLink,
} from "mdbreact";
import { Link } from "react-router-dom";

export const Navbar = (props) => {
  let { hideAll, quit } = props;
  let [openNav, setNav] = useState(false);
  let [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (quit && !hideAll) {
      setShowNav(true);
    }
  }, [hideAll, quit]);
  const SideBar = () => {
    setNav(!openNav);
  };
  return (
    <>
      <MDBNavbar
        dark
        expand="md"
        fixed="top"
        className={hideAll || showNav ? "opa_hide" : "opa_show"}
        style = {{position : "relative", display : "flex", justifyContent : "center"}}
      >
        <MDBNavbarBrand>
          {/* <Link to="/"><img src={require('../assets/icons/logo.jpg')} style={{ width: '40%' }} /></Link> */}
          <Link to="/" style={{color: "#333333", fontWeight: 600 }}>
            DO NOT BLINK  <span style={{fontSize:'0.6em'}}>v0.5</span>
          </Link>
        </MDBNavbarBrand>
        
      </MDBNavbar>
      {/* side navbar */}
      {openNav ? (
        <MDBContainer>
          {/* <MDBSideNav
            fixed={true}
            slim={true}
            hidden
            triggerOpening={openNav}
            breakWidth={1500}
          >
            <li
              style={{
                padding: "30px 20px",
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <Link to="/" onClick={SideBar}>
                {" "}
                DO NOT BLINK{" "}
              </Link>
            </li>
            <li>
              <MDBNavLink to="/about" onClick={SideBar}>
                About
              </MDBNavLink>
            </li>
            <li>
              <MDBNavLink to="/content" onClick={SideBar}>
                Content
              </MDBNavLink>
            </li>
            {quit ? (
              <li>
                <MDBNavLink
                  to="/"
                  color={"danger"}
                  outline={true}
                  style={{
                    border: "2px solid #ff3547",
                    background: "transparent",
                    color: "#ff3547",
                    margin: "0px 8px",
                    borderRadius: 3,
                    padding: "8px 20px",
                  }}
                >
                  Quit
                </MDBNavLink>
              </li>
            ) : (
              <li>
                <MDBNavLink
                  to="/"
                  color={"success"}
                  outline={true}
                  style={{
                    border: "2px solid #04af04",
                    background: "transparent",
                    color: "#04af04",
                    margin: "0px 8px",
                    borderRadius: 3,
                    padding: "8px 20px",
                  }}
                >
                  Start
                </MDBNavLink>
              </li>
            )}
          </MDBSideNav> */}
        </MDBContainer>
      ) : null}
    </>
  );
};

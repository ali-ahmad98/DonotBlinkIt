import React from "react";
import "../App.css";
import {
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBCard,
  MDBListGroup,
  MDBListGroupItem,
  MDBCollapse,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdbreact";
import { Sets } from "../Sets";
import { connect } from "react-redux";
import { setSentences } from "../store/sentences/action";
import { Navbar } from "../components/navbar";
import FullScreenMode from "../components/FullScreen";

class ContentPage extends React.Component {
  state = {
    openNav: false,
    desktop: false,
    isOpen: false,
    collapseID: "",
    activeItem: "1",
  };

  toggleCollapse = (collapseID) => () => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };

  componentDidMount() {
    window.addEventListener("resize", this.UpdateDesktop);
  }
  componentWillMount() {
    window.addEventListener("resize", this.UpdateDesktop);
  }
  UpdateDesktop = () => {
    this.setState({ desktop: !this.state.desktop });
  };
  toggle = (tab) => (e) => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab,
      });
    }
  };
  splitSentences = (song) => {
    if (song.length === 0) {
      this.setState({ alert: "Please add some text or paste it" });
      setTimeout(() => this.setState({ alert: "" }), 1000);
      return;
    }
    let sentences = [];
    let signs = ["\n", "?", ".", "!"];
    for (let j = 0; j < song.length; j++) {
      const letter = song[j];
      if (signs.includes(letter)) {
        const index = song.indexOf(letter) + 1;
        const newSentence = song.slice(0, index);
        let removeExtraSigns = newSentence;
        for (let i = index; i < song.length; i++) {
          if (signs.includes(song[i])) {
            removeExtraSigns += song[i];
          } else {
            break;
          }
        }
        j = 0;
        song = song.replace(removeExtraSigns, "");
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.replace(/\s{2,}/g, " ").trim(),
            mastered: null,
            tried: false,
          });
        }
      } else if (j === song.length - 1) {
        const newSentence = song.slice(0, song.length);
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.replace(/\s{2,}/g, " ").trim(),
            mastered: null,
            tried: false,
          });
        }
      }
    }
    this.props.setSentences(sentences);
    this.props.history.push("editCode");
  };
  render() {
    return (
      <div>
        {/* navbar */}
        <Navbar quit={false} />
        <MDBContainer style={{ height: window.innerHeight, marginTop: "10%" }}>
          <MDBRow>
            <MDBCol size={2} md={4} lg={4}>
              <h1>Our sets</h1>
              <p>
                Here is our selection of sets. It's not much yet, but we are
                working on it. If you have some ideas or ready sets,{" "}
                <a href="mailto:one@thetime.pl">contact us please. </a>
                You can also support us here.
              </p>
            </MDBCol>
            <MDBCol sm={12} md={8} lg={8}>
              <MDBContainer>
                <MDBNav className="nav-tabs mt-5">
                  <MDBNavItem>
                    <MDBNavLink
                      link
                      to="#"
                      active={this.state.activeItem === "1"}
                      onClick={this.toggle("1")}
                      role="tab"
                    >
                      Music
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      link
                      to="#"
                      active={this.state.activeItem === "2"}
                      onClick={this.toggle("2")}
                      role="tab"
                    >
                      Grammar
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      link
                      to="#"
                      active={this.state.activeItem === "3"}
                      onClick={this.toggle("3")}
                      role="tab"
                    >
                      Idioms
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      link
                      to="#"
                      active={this.state.activeItem === "4"}
                      onClick={this.toggle("4")}
                      role="tab"
                    >
                      Spelling
                    </MDBNavLink>
                  </MDBNavItem>
                </MDBNav>
                <MDBTabContent activeItem={this.state.activeItem}>
                  <MDBTabPane tabId="1" role="tabpanel">
                    <MDBListGroup
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        fontSize: "1em",
                      }}
                    >
                      {Sets.songs.map((song, index) => (
                        <>
                          {" "}
                          <MDBListGroupItem
                            style={styles.accordionContainer}
                            key={song.id}
                            onClick={this.toggleCollapse(song.id)}
                          >
                            {song.title}
                            <h6
                              style={styles.learnIt}
                              onClick={() => this.splitSentences(song.song)}
                            >
                              Learn it!
                            </h6>
                          </MDBListGroupItem>
                          <MDBCard>
                            <MDBContainer>
                              <MDBCollapse
                                isOpen={this.state.collapseID}
                                id={song.id}
                              >
                                {song.song.split("\n").map((data) => (
                                  <p style={{ textAlign: "center" }}>
                                    {data}
                                    <br />{" "}
                                  </p>
                                ))}
                              </MDBCollapse>
                            </MDBContainer>
                          </MDBCard>
                        </>
                      ))}
                    </MDBListGroup>
                  </MDBTabPane>
                  <MDBTabPane tabId="2" role="tabpanel">
                    <MDBListGroup
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        fontSize: "1em",
                      }}
                    >
                      {Sets.grammers.map((grammer, index) => (
                        <>
                          <MDBListGroupItem
                            style={styles.accordionContainer}
                            key={grammer.id}
                            onClick={this.toggleCollapse(grammer.id)}
                          >
                            {grammer.title}
                            <h6
                              style={styles.learnIt}
                              onClick={() =>
                                this.splitSentences(grammer.grammer)
                              }
                            >
                              Learn it!
                            </h6>
                          </MDBListGroupItem>
                          <MDBCard>
                            <MDBContainer>
                              <MDBCollapse
                                isOpen={this.state.collapseID}
                                id={grammer.id}
                              >
                                {grammer.song.split("\n").map((data) => (
                                  <p style={{ textAlign: "center" }}>
                                    {data}
                                    <br />{" "}
                                  </p>
                                ))}
                              </MDBCollapse>
                            </MDBContainer>
                          </MDBCard>
                        </>
                      ))}
                    </MDBListGroup>
                  </MDBTabPane>
                  <MDBTabPane tabId="3" role="tabpanel">
                    <MDBListGroup
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        fontSize: "1em",
                      }}
                    >
                      {Sets.idioms.map((idiom, index) => (
                        <>
                          {" "}
                          <MDBListGroupItem
                            style={styles.accordionContainer}
                            key={idiom.id}
                            onClick={this.toggleCollapse(idiom.id)}
                          >
                            {idiom.title}
                            <h6
                              style={styles.learnIt}
                              onClick={() => this.splitSentences(idiom.song)}
                            >
                              Learn it!
                            </h6>
                          </MDBListGroupItem>
                          <MDBCard>
                            <MDBContainer>
                              <MDBCollapse
                                isOpen={this.state.collapseID}
                                id={idiom.id}
                              >
                                {idiom.song.split("\n").map((data) => (
                                  <p style={{ textAlign: "center" }}>
                                    {data}
                                    <br />
                                  </p>
                                ))}
                              </MDBCollapse>
                            </MDBContainer>
                          </MDBCard>
                        </>
                      ))}
                    </MDBListGroup>
                  </MDBTabPane>
                </MDBTabContent>
              </MDBContainer>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FullScreenMode />
      </div>
    );
  }
}

const styles = {
  accordionContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  learnIt: {
    color: "#1db71d",
    fontWeight: "500",
    marginBottom: "0px",
  },
};

const mapDispatchToProps = { setSentences };
export default connect(null, mapDispatchToProps)(ContentPage);

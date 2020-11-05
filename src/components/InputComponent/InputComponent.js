import React, { Component } from "react";
import { MDBInput, MDBBtn, MDBRow, MDBContainer, MDBCol, MDBListGroupItem, MDBListGroup } from "mdbreact";
import "./input.css";
import { AlertMessage } from "../Alert";
import { Sets } from "../../Sets";
import { connect } from "react-redux";
import { setSentences } from "../../store/sentences/action";
import { Link } from "react-router-dom";
class InputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "Paste any text that you want to learn", // Paragraph input in which user add paragrah to learn
      sentences: [], // separated sentences
      showSection: 0, // show respective containers
      hideReady: true, // Show Ready text
      sentenceIndex: 0, // Sentence index shows the current sentence
      inputWord: "", // the input which user is answering while learning

      per: ["perfect", "amazing", "flawless"],
      selectedNote: "",

      //Here is the counter of flashes and length of the first flash states
      count: 1,
      countsec: 200,
      perfect: false,
      inputHidden: true,
      againHidden: true,
      showWord: false,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      color: "white",
      tryAgain: false,
      in: 0,
      te: false,
      flashCount: 1,

      againSentenceMessage: false,
      flashBannerTiming: 3800, // Flash one don't blink text banner timing
      inputStyle: {
        color: "black",
      },
      alert: "",
      textToLearn: "",
    };
  }

  componentDidMount() {
    let { textToLearn } = this.props;

    if (textToLearn) {
      this.setState({ inputValue: textToLearn });
    }
  }

  splitSentences = () => {
    let { inputValue } = this.state;
    if (inputValue.length === 0) {
      this.setState({ alert: "Please add some text or paste it" });
      setTimeout(() => this.setState({ alert: "" }), 1000);
      return;
    }
    let sentences = [];
    let signs = ["\n", "?", ".", "!"];
    for (let j = 0; j < inputValue.length; j++) {
      const letter = inputValue[j];
      if (signs.includes(letter)) {
        const index = inputValue.indexOf(letter) + 1;
        const newSentence = inputValue.slice(0, index);
        let removeExtraSigns = newSentence;
        for (let i = index; i < inputValue.length; i++) {
          if (signs.includes(inputValue[i])) {
            removeExtraSigns += inputValue[i];
          } else {
            break;
          }
        }
        j = 0;
        inputValue = inputValue.replace(removeExtraSigns, "");
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.replace(/\s{2,}/g, " ").trim(),
            mastered: null,
            tried: false,
          });
        }
      } else if (j === inputValue.length - 1) {
        const newSentence = inputValue.slice(0, inputValue.length);
        // j = 0;
        // inputValue = inputValue.replace(newSentence, '');
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.replace(/\s{2,}/g, " ").trim(),
            mastered: null,
            tried: false,
          });
        }
      }
    }
    // this.setState({ sentences });
    this.props.setSentences(sentences);
    this.props.navigate("editCode");
  };
  addTextToLearn = (text) => {
    this.setState({ inputValue: text });
  };
  render() {
    const { inputValue, showSection } = this.state;
    // const { inputValue, showSection, sentences } = this.state;
    // let [notTriedSentencesCount, masteredCount, notMasteredCount] = [0, 0, 0];
    // sentences.forEach((obj) => {
    //   if (!obj.tried) {
    //     ++ notTriedSentencesCount;
    //   } else {
    //     if (obj.mastered) {
    //       ++masteredCount;
    //     } else if (obj.mastered === false) {
    //       ++notMasteredCount;
    //     }
    //   }
    // });

    return (
      <MDBContainer>
        {showSection === 0 && (
          <>
            <br />
            <MDBRow>
              <MDBCol sm={12} lg={8} md={6} className="textarea_container" style={{ textAlign: "center" }}>
                {showSection === 0 && (
                  <MDBInput
                    type="textarea"
                    size="lg"
                    rows={10}
                    className="text-center"
                    onFocus={(e) =>
                      e.currentTarget.value === "Paste any text that you want to learn"
                        ? this.setState({ inputValue: "" })
                        : null
                    }
                    onBlur={(e) =>
                      e.currentTarget.value.length === 0
                        ? this.setState({
                            inputValue: "Paste any text that you want to learn",
                          })
                        : null
                    }
                    value={inputValue}
                    onChange={(event) => this.setState({ inputValue: event.target.value })}
                  />
                )}

                {showSection === 0 && (
                  <MDBBtn
                    onClick={() => this.splitSentences()}
                    style={{ width: "130px", height: "45px", padding: "4px" }}
                    outline
                    color="dark"
                  >
                    <p style={{ fontSize: "20px" }}> Learn it! </p>
                  </MDBBtn>
                )}
              </MDBCol>
              <MDBCol sm={12} lg={4} md={6} style={{ textAlign: "center" }}>
                {/* Content Section Starts from here */}
                <h4 style={{ textAlign: "center", padding: "10px 0" }}>or learn one of these sets:</h4>

                <div className="content">
                  <MDBContainer>
                    <MDBListGroup
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        fontSize: ".6em",
                      }}
                    >
                      {Sets.songs
                        .sort(() => Math.random() - 0.5)
                        .map(
                          (song) =>
                            song.id < 3 && (
                              <MDBListGroupItem
                                key={song.id}
                                onClick={() => {
                                  this.setState({ inputValue: song.song });
                                  AlertMessage({
                                    message: `"Link ${song.id} has been added`,
                                  });
                                }}
                              >
                                Link {song.id}
                              </MDBListGroupItem>
                            )
                        )}
                      {Sets.grammers
                        .sort(() => Math.random() - 0.5)
                        .map(
                          (grammer) =>
                            grammer.id < 3 && (
                              <MDBListGroupItem
                                key={grammer.id}
                                onClick={() => {
                                  this.setState({
                                    inputValue: grammer.grammer,
                                  });
                                  AlertMessage({
                                    message: `Link ${grammer.id} has been added`,
                                  });
                                }}
                              >
                                Link {grammer.id}
                              </MDBListGroupItem>
                            )
                        )}
                      {Sets.idioms
                        .sort(() => Math.random() - 0.5)
                        .map(
                          (idiom) =>
                            idiom.id < 3 && (
                              <MDBListGroupItem
                                key={idiom.id}
                                onClick={() => {
                                  this.setState({ inputValue: idiom.idiom });
                                  AlertMessage({
                                    message: `Link ${idiom.id} has been added`,
                                  });
                                }}
                              >
                                Link {idiom.id}
                              </MDBListGroupItem>
                            )
                        )}
                      <Link to="/content">
                        <MDBListGroupItem style={{ color: "#1985cf" }}>See more sets to learn...</MDBListGroupItem>
                      </Link>
                    </MDBListGroup>
                  </MDBContainer>
                </div>
              </MDBCol>
            </MDBRow>
          </>
        )}
      </MDBContainer>
    );
  }
}

const mapDispatchToProps = { setSentences };

export default connect(null, mapDispatchToProps)(InputComponent);

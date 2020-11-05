import React, { Component } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBAnimation,
  MDBRow,
  MDBContainer,
  MDBCol,
  MDBAlert,
  MDBListGroupItem,
  MDBListGroup,
} from "mdbreact";
import "./LearningSession.css";
import "../../App.css";
import { AlertMessage } from "../Alert";
import VisualizerComponent from "../Visualization";
import { Sets } from "../../Sets";
import Modal from "../modal";
import { connect } from "react-redux";
import { setSentences } from "../../store/sentences/action";
import { ToastContainer } from "react-toastify";

class LearningSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "", // Paragraph input in which user add paragrah to learn
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
      AlertMessage({ message: "Please add some text or paste it" });
      return;
    }
    let sentences = [];
    let signs = ["\n", "?", ".", "!", ","];
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
          sentences.push({ sentence: newSentence.trim(), mastered: null, tried: false });
        }
      } else if (j === inputValue.length - 1) {
        const newSentence = inputValue.slice(0, inputValue.length);
        // j = 0;
        // inputValue = inputValue.replace(newSentence, '');
        if (newSentence.trim()) {
          sentences.push({ sentence: newSentence.trim(), mastered: null, tried: false });
        }
      }
    }
    this.setState({ sentences });
    this.props.setSentences(sentences);
    this.props.navigate("editCode");
  };

  startLearning = () => {
    if (this.state.inputValue.length === 0) {
      AlertMessage({ message: "Please add some text or paste it" });
    } else {
      if (this.state.sentences.length === 0) {
        AlertMessage({ message: "Please learn first" });
      } else {
        this.setState({ showSection: 1, hideReady: false });
      }
    }
  };

  readyLearningSession = () => {
    this.setState({ hideReady: true });
    setTimeout(() => {
      this.setState({ showSection: 2 });
      this.calculateFlashTiming();
    }, this.state.flashBannerTiming);
  };

  calculateFlashTiming = () => {
    const { sentences, sentenceIndex } = this.state;
    setTimeout(() => {
      this.setState({ showSection: 3 });
      this.setState({
        clickedReady: true,
        selectedEnd: this.state.per[Math.floor(Math.random() * this.state.per.length)],
        inputHidden: false,
        hideReady: true,
        hideReadys: true,
        perfect: false,
        inputWord: "",
        showWord: false,
        timerOn: true,
        timerTime: this.state.timerTime,
        timerStart: Date.now() - this.state.timerTime,
      });
      this.timer = setInterval(() => {
        this.setState({
          timerTime: Date.now() - this.state.timerStart,
        });
      }, 10);
      // const s = this.state.sentences.length
      // if (s === this.state.in) {

      // } else {
      this.setState({
        in: this.state.in + 1,
        selectedNote: this.state.sentences[sentenceIndex].sentence,
        // selectedNote: this.state.sentences[Math.floor(this.state.in)],
      });
      // }
    }, sentences[sentenceIndex].sentence.length * 20);
  };

  handleInputWord = (e) => {
    const { sentences, sentenceIndex, selectedNote, count } = this.state;
    //Here is the color validaiton(don't touch anything here)
    let inputStyle = {
      color: "black",
    };
    let inputText = e.target.value.trim().split(" ");

    for (var i = 0; i < inputText.length; i++) {
      if (this.state.selectedNote.includes(inputText[i]) === true) {
        if (e.target.value.indexOf(inputText[i]) === this.state.selectedNote.indexOf(inputText[i])) {
          inputStyle = {
            color: "blue",
          };
        } else {
          inputStyle = {
            color: "yellow",
          };
        }
      } else {
        inputStyle = {
          color: "black",
        };
      }
    }
    if (e.target.value === selectedNote) {
      let index = sentenceIndex + 1;
      let isFlashUsed = count > 1;
      if (isFlashUsed) {
        const repeatSentence = sentences.splice(sentenceIndex, 1)[0];
        repeatSentence.mastered = false;
        repeatSentence.tried = true;
        sentences.push(repeatSentence);
        index -= 1;
      } else if (sentences[sentenceIndex]) {
        sentences[sentenceIndex].mastered = true;
        sentences[sentenceIndex].tried = true;
      }
      this.setState({
        perfect: true,
        inputWord: e.target.value,
        timerOn: false,
        showSection: 4,
        sentences,
        sentenceIndex: index,
        againSentenceMessage: isFlashUsed,
        inputStyle,
      });
      clearInterval(this.timer);
    } else {
      this.setState({
        againHidden: false,
        inputWord: e.target.value,
        inputStyle,
      });
    }
  };

  handleAgain = () => {
    this.setState({ showSection: 1, flashCount: this.state.flashCount + 1 });
    setTimeout(() => {
      //Here is the counter of flashes and length of the first flash logic
      var inc = 200 + this.state.countsec;
      setTimeout(() => {
        this.setState({
          showSection: 3,
        });
      }, inc);
      this.setState({
        count: this.state.count + 1,
        countsec: this.state.countsec + 300,
        showSection: 2,
      });
    }, this.state.flashBannerTiming);
  };

  resetState = () => {
    this.setState({
      selectedNote: "",
      clickedReady: false,
      inputWord: "",
      hideReadys: false,
      count: 1,
      perfect: false,
      inputHidden: true,
      againHidden: true,
      showWord: false,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      countsec: 200,
      spans: [],
      showSection: 1,
      hideReady: false,
      flashCount: 1,
      againSentenceMessage: false,
    });
  };

  addTextToLearn = (text) => {
    this.setState({ inputValue: text });
  };
  render() {
    const {
      inputValue,
      showSection,
      hideReady,
      sentences,
      sentenceIndex,
      inputWord,
      timerTime,
      flashCount,
      inputStyle,
      againSentenceMessage,
    } = this.state;

    // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let second = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minute = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    // let hour = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

    let [notTriedSentencesCount, notMasteredCount, masteredCount] = [0, 0, 0];
    sentences.forEach((obj) => {
      if (!obj.tried) {
        ++notTriedSentencesCount;
      } else {
        if (obj.mastered) {
          ++masteredCount;
        } else if (obj.mastered === false) {
          ++notMasteredCount;
        }
      }
    });

    return (
      <MDBContainer>
        {showSection === 0 && (
          <>
            <MDBRow>
              <MDBCol
                size={window.innerWidth > 900 ? "6" : "12"}
                className="border_container"
                style={{ textAlign: "center", marginBottom: 20 }}
              >
                {showSection === 0 && (
                  <MDBInput
                    type="textarea"
                    autoFocus
                    size="lg"
                    className="text-center"
                    value={inputValue}
                    label="Paste here any text you want to learn”"
                    onChange={(event) => this.setState({ inputValue: event.target.value })}
                  />
                )}

                {showSection === 0 && (
                  <MDBRow>
                    <MDBCol size={"12"}>
                      {/* <Link to="/editCode"  >   */}
                      <MDBBtn
                        color="success"
                        outline={true}
                        onClick={() => this.splitSentences()}
                        style={{ borderRadius: 50 }}
                      >
                        Learn it!
                      </MDBBtn>
                      {/* </Link> */}
                    </MDBCol>
                  </MDBRow>
                )}
              </MDBCol>
              <MDBCol size={window.innerWidth > 900 ? "6" : "12"} style={{ textAlign: "center" }}>
                {/* Content Section Starts from here */}
                <div
                  className="content"
                  // style={{ background: 'black', position: 'fixed', zIndex: 9999, left: 0, right: 0, padding: 10 }}
                >
                  <h1 style={{ textAlign: "center", padding: "10px 0" }}>Learn one of these contents:</h1>
                  <MDBContainer>
                    <MDBListGroup style={{ width: "100%", cursor: "pointer" }}>
                      {Sets.map((song) => (
                        <MDBListGroupItem
                          key={song.id}
                          onClick={() => {
                            this.props.toggle();
                            this.props.modalIdFunc(song.id);
                          }}
                        >
                          {" "}
                          {song.title}{" "}
                        </MDBListGroupItem>
                      ))}
                    </MDBListGroup>
                  </MDBContainer>
                  {this.props.modal ? (
                    <Modal
                      texttolearn={this.addTextToLearn}
                      move={false}
                      modalId={this.props.modalId}
                      toggle={this.props.toggle}
                      modal={this.props.modal}
                    />
                  ) : null}
                </div>
              </MDBCol>
            </MDBRow>
            {sentences.length > 0 && (
              <MDBRow>
                <MDBCol size={"12"} style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
                  <div className="border_container">
                    <ol>
                      {sentences.map((obj, i) => (
                        <li key={i}>{obj.sentence}</li>
                      ))}
                    </ol>
                  </div>

                  <MDBBtn color="success" outline={true} onClick={() => this.startLearning()}>
                    Start Learning
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            )}
          </>
        )}
        <h2 className="ready" onClick={this.readyLearningSession} hidden={this.state.hideReady}>
          Ready?
        </h2>

        {/* First flash section */}
        {showSection === 1 && hideReady && (
          <div className="os-phrases">
            <h2 style={{ cursor: "pointer" }}>
              flash {flashCount} <span className="blinking">do not</span> blink
            </h2>
          </div>
        )}

        {/* Question section */}
        {showSection === 2 && hideReady && (
          <div>
            <h1
              className="pb-2"
              style={{
                position: "fixed",
                left: "0",
                right: 0,
                top: "15rem",
                bottom: 0,
                textAlign: "center",
                margin: "0 auto",
                zIndex: 9999,
                fontSize: "3.35rem",
              }}
            >
              {sentences[sentenceIndex].sentence}
            </h1>
          </div>
        )}

        {/* Answering section */}
        {showSection === 3 && hideReady && (
          <div>
            <h2 className="count">
              {" "}
              {this.state.count} <small>{this.state.countsec / 1000}s</small>
            </h2>
            <MDBInput
              className="text-center"
              autoFocus
              style={inputStyle}
              value={inputWord}
              type="text"
              onChange={(e) => this.handleInputWord(e)}
              size="lg"
            />
            <h2 className="text-center pt-2 mb-2" style={{ cursor: "pointer" }} onClick={this.handleAgain}>
              one more flash?
            </h2>
          </div>
        )}

        {this.state.perfect && (
          <div className="text-center">
            <h2 className="count">
              {notTriedSentencesCount} {notMasteredCount} {masteredCount}/{sentences.length}
            </h2>
            <MDBInput
              type="text"
              className="text-center"
              style={inputStyle}
              value={this.state.inputWord}
              onChange={(e) => this.handleInputWord(e)}
              size="lg"
            />
            <h2>{this.state.selectedEnd}</h2>
            {againSentenceMessage && <h2>but you'll see it again soon</h2>}
            <MDBAnimation type="fadeIn" duration="1s" delay="2s">
              {/* Here is the counter of flashes */}
              <h2 className="p-2">
                {this.state.count} flashes, {minute}:{second} Seconds
              </h2>
              {sentences[sentenceIndex] !== undefined ? (
                <MDBBtn
                  outline={true}
                  color="black"
                  style={{ cursor: "pointer", margin: "30px 0", borderRadius: 50 }}
                  onClick={this.resetState}
                >
                  I want more
                </MDBBtn>
              ) : (
                <div>
                  <h2 style={{ cursor: "pointer" }}>Good Job</h2>
                  <h2 style={{ cursor: "pointer" }}>
                    you have learned {sentences.length} {sentences.length > 0 ? "sentences" : "sentence"}!
                  </h2>
                  <MDBBtn color="success" outline={true} onClick={() => this.learnAgain()}>
                    Learn it!
                  </MDBBtn>
                </div>
              )}
            </MDBAnimation>
          </div>
        )}
      </MDBContainer>
    );
  }
}

const mapDispatchToProps = { setSentences };

export default connect(null, mapDispatchToProps)(LearningSession);

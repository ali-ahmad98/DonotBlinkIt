import React, { Component } from "react";
import { MDBAnimation, MDBInput, MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import ReactTooltip from "react-tooltip";
import "./LearningSession.css";
import "../../App.css";
import { AlertMessage } from "../../components/Alert";
import { connect } from "react-redux";
import CatScreaming from "../../Musics/cat-screaming.wav";
import GoodSound from "../../Musics/good.wav";
import MasteredSound from "../../Musics/mastered.wav";
import PurrrSound from "../../Musics/purrr.wav";
import { setSentences, setMode } from "../../store/sentences/action";
import { Instruction } from "./instruction";
import { Navbar } from "../../components/navbar";
import FullScreenMode from "../../components/FullScreen";

class LearningSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FullScreen: false,

      sentences: [], // separated sentences
      showSection: 1, // show respective containers
      hideReady: false, // Show Ready text
      sentenceIndex: 0, // Sentence index shows the current sentence
      inputWord: "", // the input which user is answering while learning
      showHelp: false,
      help: [],
      per: ["perfect", "amazing", "flawless"],
      selectedNote: "",
      FSwidth: 0,
      //Here is the counter of flashes and length of the first flash states
      count: 1,
      countsec: 0,
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
      helpcount: 0,
      skipCount: 0,
      againSentenceMessage: false,
      flashBannerTiming: 1500, // Flash one don't blink text banner timing
      inputStyle: {
        color: "black",
      },
      textToLearn: "",
      enableColor: false,
      enableSound: false,
      startLearning: true,
      playSound: false,
      sentenceSkipped: 0,
      HideAll: true,
      spellCheck: false,
    };
    this.CatScreaming = new Audio(CatScreaming); // This audio for black input
    this.PurrrSound = new Audio(PurrrSound); // This audio for blue input
    this.GoodSound = new Audio(GoodSound); // this for good
    this.MasteredSound = new Audio(MasteredSound); // this for mastered
  }
  inputEl;
  componentDidMount() {
    document.addEventListener("keydown", (zEvent) => {
      if (zEvent.altKey && (zEvent.key === "h" || zEvent.key === "H")) {
        this.getHELP();
      }
    });
    const { sentences } = this.props;
    if (sentences && sentences.length > 0) {
      this.setState({ sentences: this.removeTabsDoubleSpaces(sentences) });
      if (window.innerWidth > 600) {
        window.addEventListener("keypress", this.StartSession);
      } else {
        window.addEventListener("touchstart", this.MobileStartSession);
      }
      this.setState({ startLearning: false });
    } else {
      this.props.history.push("/");
    }
  }
  removeTabsDoubleSpaces = (inputArray) => {
    let newArray = [];
    for (let i = 0; i < inputArray.length; i++) {
      let str = inputArray[i].sentence;
      str = str.replace(/\s{2,}/g, " ");
      str = str.replace(/\t/g, " ");
      str = str
        .toString()
        .trim()
        .replace(/(\r\n|\n|\r)/g, "")
        .trim();
      let newObj = {
        ...inputArray[i],
        sentence: str,
      };
      newArray.push(newObj);
    }
    return newArray;
  };
  getHELP = async () => {
    let originalInput = [];
    for (let i = 0; i < this.state.inputWord.length; i++)
      originalInput.push({
        value: this.state.inputWord[i],
        color: "black",
      });
    this.setState({
      showHelp: true,
      help: originalInput,
      helpcount: this.state.helpcount + 1,
    });
    const wait = (timeout) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, timeout);
      });
    let i = 0;
    let mistake = false;
    while (i < this.state.inputWord.length) {
      if (this.state.selectedNote[i] === this.state.inputWord[i]) {
        originalInput[i] = {
          value: this.state.inputWord[i],
          color: "blue",
        };
        this.setState({ showHelp: true, help: originalInput });
        await wait(200);
      } else if (
        this.state.selectedNote[i] === this.state.inputWord[i].toLowerCase() ||
        this.state.selectedNote[i] === this.state.inputWord[i].toUpperCase()
      ) {
        mistake = true;
        originalInput[i] = {
          value: this.state.inputWord[i],
          color: "RED",
        };
        this.setState({ showHelp: true, help: originalInput }, async () => {
          await wait(4000);
          this.setState({
            showHelp: false,
            help: [],
          });
        });
        await wait(200);
        break;
      } else {
        mistake = true;
        originalInput[i] = {
          value: this.state.inputWord[i],
          color: "RED",
        };
        this.setState({ showHelp: true, help: originalInput }, async () => {
          await wait(4000);
          this.setState({
            showHelp: false,
            help: [],
          });
        });
        await wait(200);
        break;
      }
      i++;
    }
    if (!mistake) {
      this.setState({
        showHelp: true,
        help: [
          {
            value: `You haven't made a mistake, just finish it :)`,
            color: "green",
          },
        ],
      });
      await wait(4000);
      this.setState({
        showHelp: false,
        help: [],
      });
    }
  };
  checkInputColor = (enableColor) => {
    const { inputWord, selectedNote } = this.state;
    let inputStyle = {
      color: "black",
    };
    if (enableColor && selectedNote.startsWith(inputWord)) {
      inputStyle.color = "blue";
    }
    this.setState({ inputStyle });
  };
  play(musicName) {
    let { enableSound } = this.state;
    if (!enableSound) {
      return;
    }
    this[musicName].play();
    setTimeout(() => {
      this[musicName].pause();
      this[musicName].currentTime = 0;
    }, 1200);
  }

  splitSentences = () => {
    let { inputValue } = this.state;
    if (inputValue.length === 0) {
      AlertMessage({ message: "Please add some text" });
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
          sentences.push({
            sentence: newSentence.trim(),
            mastered: null,
            tried: false,
          });
        }
      } else if (j === inputValue.length - 1) {
        const newSentence = inputValue.slice(0, inputValue.length);
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.trim(),
            mastered: null,
            tried: false,
          });
        }
      }
    }
    this.setState({ sentences });
    this.props.setSentences(sentences);
  };

  readyLearningSession = () => {
    if (!this.state.hideReady) {
      this.setState({ hideReady: true });
    }
    setTimeout(() => {
      this.setState({ showSection: 2 });
      this.calculateFlashTiming();
    }, this.state.flashBannerTiming);
    if (window.innerWidth > 600) {
      window.removeEventListener("keypress", this.StartSession);
    } else {
      window.removeEventListener("touchstart", this.MobileStartSession);
    }
  };
  StartSession = (e) => {
    if (e.keyCode === 13) {
      this.readyLearningSession();
    }
  };
  MobileStartSession = () => {
    this.readyLearningSession();
  };
  calculateFlashTiming = () => {
    const { sentences, sentenceIndex } = this.state;
    let time = sentences[sentenceIndex].sentence.length * 30;
    let flash_time = time > 300 ? time : 300;
    setTimeout(() => {
      this.setState({
        showSection: 3,
        clickedReady: true,
        selectedEnd: this.state.per[Math.floor(Math.random() * this.state.per.length)],
        inputHidden: false,
        hideReady: true,
        perfect: false,
        inputWord: "",
        showWord: false,
        timerOn: true,
        countsec: flash_time,
        timerStart: Date.now() - this.state.timerTime,
        in: this.state.in + 1,
        selectedNote: this.state.sentences[sentenceIndex].sentence,
      });
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.setState({
          timerTime: Date.now() - this.state.timerStart,
        });
      }, 10);
    }, flash_time); // milliseconds on each word in flash
  };

  handleInputWord = (e) => {
    const { sentences, sentenceIndex, selectedNote, count, enableColor } = this.state;
    //Here is the color validaiton(don't touch anything here)
    let inputStyle = {
      color: "black",
    };
    let inputText = e.target.value.replaceAll(/\s{2,}/g, " ");
    if (
      enableColor &&
      selectedNote
        .replaceAll(/\s{2,}/g, " ")
        .trim()
        .startsWith(inputText.trim())
    ) {
      inputStyle = {
        color: "blue",
      };
    } else {
      inputStyle = {
        color: "black",
      };
    }

    if (inputStyle.color === "blue") {
      this.play("PurrrSound");
    } else {
      this.play("CatScreaming");
    }
    if (inputText.trim() === selectedNote.replaceAll(/\s{2,}/g, " ").trim()) {
      let index = sentenceIndex + 1;
      let isFlashUsed = count > 1;
      if (isFlashUsed && this.props.mode === "memory") {
        const repeatSentence = sentences.splice(sentenceIndex, 1)[0];
        repeatSentence.mastered = false;
        repeatSentence.tried = true;
        sentences.push(repeatSentence);
        index -= 1;
        this.play("GoodSound");
      } else if (sentences[sentenceIndex]) {
        sentences[sentenceIndex].mastered = true;
        sentences[sentenceIndex].tried = true;
        this.play("MasteredSound");
      }
      this.setState({
        perfect: true,
        inputWord: inputText,
        timerOn: false,
        showSection: 4,
        sentences,
        sentenceIndex: index,
        againSentenceMessage: isFlashUsed,
        inputStyle,
      });

      clearInterval(this.timer);
      this.enableWindowKeyboardListener();
    } else {
      this.setState({
        againHidden: false,
        inputWord: inputText,
        inputStyle,
      });
    }
  };

  toggleFullScreen = () => {
    if (window.fullScreen || (window.innerWidth == window.screen.width && window.innerHeight == window.screen.height)) {
      document.exitFullscreen().catch(() => null);
    } else {
      document
        .getElementById("root")
        .requestFullscreen()
        .catch(() => null);
    }
  };

  handleAgain = () => {
    this.setState({ showSection: 1, flashCount: this.state.flashCount + 1 });
    setTimeout(() => {
      //Here is the counter of flashes and length of the first flash logic
      var inc = this.state.countsec + 300;
      setTimeout(() => {
        this.setState({
          showSection: 3,
        });
      }, inc);
      this.setState({
        count: this.state.count + 1,
        countsec: inc,
        showSection: 2,
      });
    }, this.state.flashBannerTiming);
  };

  resetState = () => {
    this.setState({
      selectedNote: "",
      clickedReady: false,
      inputWord: "",
      count: 1,
      perfect: false,
      inputHidden: true,
      againHidden: true,
      showWord: false,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      countsec: 0,
      spans: [],
      showSection: 1,
      flashCount: 1,
      againSentenceMessage: false,
    });
    this.readyLearningSession();
  };

  SkipSentence = () => {
    let { sentenceIndex, sentences } = this.state;
    let updatedSentences = sentences.filter((sentence, i) => sentenceIndex !== i);
    if (sentenceIndex === sentences.length - 1) {
      this.setState({
        perfect: true,
        timerOn: false,
        showSection: 4,
        inputWord: "",
        sentences: updatedSentences,
      });
      this.props.setSentences(sentences);
      this.props.history.push("result-page");
    } else {
      this.setState({ sentences: updatedSentences });
      this.resetState();
    }
    AlertMessage({ message: "Skipped." });
  };

  enableWindowKeyboardListener = () => {
    window.addEventListener("keydown", this.windowKeyboardListener);
  };
  windowKeyboardListener = (event) => {
    if (event.keyCode === 13 && event.shiftKey) {
      this.SkipSentence();
    } else if (event.keyCode === 13) {
      const { sentences, sentenceIndex } = this.state;
      if (sentences[sentenceIndex] !== undefined) {
        this.nextSentence();
        return;
      }
      this.youLearnItButtonPressed();
    }
  };

  disableWindowKeyboardListener = () => {
    window.removeEventListener("keydown", this.windowKeyboardListener);
  };

  nextSentence = () => {
    this.resetState();
    this.disableWindowKeyboardListener();
  };
  youLearnItButtonPressed = () => {
    this.props.setSentences(this.state.sentences);
    window.location = `https://donotblink.app/after/`;
    this.disableWindowKeyboardListener();
  };

  render() {
    const {
      showSection,
      hideReady,
      sentences,
      sentenceIndex,
      inputWord,
      timerTime,
      flashCount,
      inputStyle,
      againSentenceMessage,
      enableColor,
      enableSound,
      hideAll,
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
      <>
        {/* navbar */} <Navbar quit={true} hideAll={hideAll || hideReady} />{" "}
        <MDBContainer
          className="main_container"
          onMouseMove={() => {
            if (this.state.hideAll) {
              this.setState({ hideAll: false });
            }
          }}
        >
          <div className="flash_anim">
            {/* <h2 hidden={!this.state.startLearning}>
              {" "}
              <span className="blinking"> do not </span> blink
            </h2>
            <h2 hidden={!this.state.startLearning}>
              {" "}
              {window.innerWidth < 600 ? "Tap" : "Press Enter"} to see the first
              flash. F11 for Full Screen.{" "}
            </h2> */}
            {!this.state.startLearning && (
              <MDBAnimation type="fadeIn" duration="1s" delay="0.5s">
                <small
                  className="glow"
                  style={{ textAlign: "center" }}
                  hidden={this.state.startLearning || this.state.hideReady}
                >
                  {" "}
                  <b> {window.innerWidth < 600 ? "Tap" : "Press Enter"} </b> to see the first flash{" "}
                </small>
              </MDBAnimation>
            )}
          </div>
          {/* First flash section */}{" "}
          {showSection === 1 && hideReady && (
            <div className="flash_anim">
              <h2
                style={{
                  fontSize: "2rem",
                  textAlign: "center",
                  fontWeight: 400,
                  cursor: "pointer",
                }}
              >
                {" "}
                flash {flashCount}{" "}
              </h2>{" "}
            </div>
          )}
          {/* Question section */}{" "}
          {showSection === 2 && hideReady && (
            <h1
              style={{
                fontSize: "2rem",
                marginTop: 0,
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              {" "}
              {sentences[sentenceIndex] && sentences[sentenceIndex].sentence}{" "}
            </h1>
          )}
          {/* Count Section */}{" "}
          {hideReady && (
            <div style={hideAll || hideReady ? { position: "fixed", top: 10, left: 0, right: 0 } : {}}>
              <MDBRow>
                <MDBCol size={"6"}>
                  <div className="left_count">
                    <h2
                      style={{
                        fontSize: hideAll || hideReady ? "medium" : "inherit",
                        marginTop: "12px",
                      }}
                    >
                      <span
                        className="same_font"
                        data-tip={`Flashing Time: ${(this.state.countsec / 1000).toFixed(1)}
                            second.`}
                      >
                        {this.state.count}
                      </span>
                      {/* <span
                        data-tip={`Flashing Time: ${(
                          this.state.countsec / 1000
                        ).toFixed(1)}
                            second. Next one will be a little longer.`}
                      >
                        &nbsp;{(this.state.countsec / 1000).toFixed(1)}s
                      </span> */}
                    </h2>
                    <div
                      className={
                        hideAll || hideReady
                          ? "opa_hide custom-control custom-switch"
                          : "opa_show custom-control custom-switch"
                      }
                    >
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitches"
                        checked={enableColor}
                        onChange={() => {
                          this.setState({ enableColor: !enableColor });
                          this.checkInputColor(!enableColor);
                        }}
                        readOnly
                      />
                      <label className="custom-control-label" htmlFor="customSwitches">
                        COLORS
                      </label>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol size={"6"} style={{ textAlign: "center" }}>
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                  {/* <MDBBtn
                    color="white"
                    style={{
                      boxShadow: "none",
                    }}
                    data-tip={Instruction}
                    className="no_border"
                  >
                    INFO
                  </MDBBtn> */}
                  <MDBBtn
                    color="white"
                    style={{
                      boxShadow: "none",
                      display: "inline-block",
                    }}
                    data-tip="Press Alt+h to call for HELP."
                    className="no_border top_right_menu"
                    onClick={this.getHELP}
                    disabled={this.state.perfect && hideReady}
                  >
                    HELP
                  </MDBBtn>

                  <MDBBtn
                    color="white"
                    className="no_border top_right_menu"
                    style={{
                      boxShadow: "none",
                      display: "inline-block",
                    }}
                    data-tip="Press Shift+Enter to skip this sentence."
                    onClick={this.SkipSentence}
                    disabled={this.state.perfect && hideReady}
                  >
                    SKIP
                  </MDBBtn>

                  <MDBBtn
                    color="white"
                    style={{
                      boxShadow: "none",
                      display: "inline-block",
                    }}
                    href="https://donotblink.app/quit/"
                    className="top_right_menu"
                    data-tip="Quit & Go to the Main Screen"
                  >
                    QUIT
                  </MDBBtn>
                </MDBCol>
                <MDBCol size={"3"}>
                  <div className="float-right right_count">
                    <h2
                      style={{
                        fontSize: hideAll || hideReady ? "medium" : "inherit",
                        marginTop: "12px",
                      }}
                    >
                      {this.props.mode == "memory" && (
                        <>
                          <span
                            data-tip={`
                            ${notTriedSentencesCount}
                            more new `}
                          >
                            {notTriedSentencesCount}
                          </span>
                          <span
                            data-tip={`
                            ${notMasteredCount}
                            to
                            try again `}
                          >
                            {" "}
                            &nbsp;{notMasteredCount} &nbsp;{" "}
                          </span>
                        </>
                      )}
                      {/* <span
                        data-tip={`
                            ${masteredCount}
                            out of ${sentences.length}
                            done `}
                      >
                        {" "}
                        {masteredCount}/{sentences.length}
                      </span> */}
                    </h2>
                    <div
                      className={
                        hideAll || hideReady
                          ? "opa_hide custom-control custom-switch"
                          : "opa_show custom-control custom-switch"
                      }
                    >
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitches1"
                        checked={enableSound}
                        onChange={() => this.setState({ enableSound: !enableSound })}
                        readOnly
                      />
                      <label className="custom-control-label" htmlFor="customSwitches1">
                        SOUNDS
                      </label>
                    </div>
                  </div>
                  {/* <FullScreenMode
                    style={
                      hideAll || hideReady
                        ? {
                            opacity: 1,
                            width: "22px",
                            top: "18px",
                            visibility: "visible",
                            right: "25px",
                          }
                        : {}
                    }
                  /> */}
                </MDBCol>
              </MDBRow>
              {/* <ReactTooltip id = "outOf" type = "dark" place = "bottom" effect = "solid">
                <span>
                      {masteredCount} out of {sentences.length} done
                </span>
              </ReactTooltip>
              <div style = {{display : "flex", justifyContent : "center"}}>
                <span
                  data-tip
                  data-for = "outOf"
                >
                  {" "}
                  {masteredCount}/{sentences.length}
                </span>
              </div> */}
            </div>
          )}
          {/* Answering section */}
          {showSection === 3 && hideReady && (
            <div>
              {this.state.showHelp ? (
                <div
                  onClick={() => {
                    this.setState({
                      showHelp: false,
                      help: [],
                    });
                  }}
                  style={{ textAlign: "center" }}
                  className="container"
                >
                  {this.state.help.map((char) => (
                    <span
                      style={{
                        backgroundColor: char.color,
                        color: "#FFFFFF",
                        fontSize: "2em",
                        padding: "0px",
                        width: char.value ? "auto" : "5px",
                      }}
                    >
                      {char.value ? char.value : " _ "}
                    </span>
                  ))}
                </div>
              ) : (
                <MDBInput
                  className="text-center text-center2"
                  autoFocus
                  ref={(x) => (this.InputEl = x)}
                  onFocus={(x) => {
                    x.currentTarget.style.borderBottom = "0px solid black";
                  }}
                  onBlur={(x) => {
                    x.currentTarget.style.borderBottom = "3px solid black";
                  }}
                  style={{
                    ...inputStyle,
                    marginTop: "2em",
                    fontSize: "2rem",
                    fontWeight: "400",
                    borderBottom: "3px solid black",
                    boxShadow: "0 0px 0 0 black",
                  }}
                  value={inputWord}
                  type="text"
                  spellCheck={this.state.spellCheck}
                  onChange={(e) => {
                    this.handleInputWord(e);
                    this.setState({ hideAll: true });
                  }}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13 && e.shiftKey) {
                      this.SkipSentence();
                    } else if (e.keyCode === 13) {
                      this.handleAgain();
                    }
                  }}
                  size="lg"
                />
              )}

              <h3
                className="text-center pt-2 mb-2"
                style={{ cursor: "pointer", width: "20%", margin: "0 auto" }}
                onClick={this.handleAgain}
              >
                <i
                  className="fa fa-repeat"
                  style={{ fontSize: "medium" }}
                  data-tip={"press Enter if you need another flash"}
                ></i>
              </h3>
              {/* SKIP BUTTON */}
              <MDBBtn
                outline={true}
                color="black"
                className={hideAll || hideReady ? "opa_hide skip" : "opa_show skip"}
                style={{
                  cursor: "pointer",
                  margin: "30px 0",
                  borderRadius: 50,
                }}
                onClick={this.SkipSentence}
              >
                Skip{" "}
              </MDBBtn>

              {/* LEARNING SESSION BUTTONS */}
            </div>
          )}
          {this.state.perfect && hideReady && (
            <div className="text-center">
              <ReactTooltip id="outOf" type="dark" place="bottom" effect="solid">
                <span>
                  {masteredCount} out of {sentences.length} done
                </span>
              </ReactTooltip>
              <div className="same_font" style={{ display: "flex", justifyContent: "center" }}>
                <span data-tip data-for="outOf">
                  {" "}
                  {masteredCount}/{sentences.length}
                </span>
              </div>
              <MDBInput
                type="text"
                className="text-center text-center2 input-container"
                style={inputStyle}
                value={this.state.inputWord}
                onChange={(e) => this.handleInputWord(e)}
                size="lg"
              />
              {this.props.mode === "memory" && (
                <div className="bottom_message">
                  {againSentenceMessage ? (
                    <>
                      <h2>Good</h2>
                      <h4>you will see this sentence again</h4>
                      <h4>rewrite it with only 1 flash to master it</h4>
                    </>
                  ) : (
                    <h4>mastered!</h4>
                  )}
                </div>
              )}
              <MDBAnimation type="fadeIn" duration="1s" delay="1s">
                {/* {this.state.helpcount === 0 && this.state.count === 1 && (
                  <h4 className = "same_font">(Very Good)</h4>
                )} */}
                <div>
                  {this.state.count === 1 ? (
                    <h4 style={{ display: "inline-block" }} className="p-2 same_font">
                      You needed {this.state.count} flash
                    </h4>
                  ) : (
                    <h4 style={{ display: "inline-block" }} className="p-2 same_font">
                      You needed {this.state.count} flashes
                    </h4>
                  )}

                  {this.state.count === 1 && (
                    <h4 style={{ display: "inline-block" }} className="same_font">
                      (Very Good)
                    </h4>
                  )}
                </div>
                <div>
                  <h4 style={{ display: "inline-block" }} className="p-2 same_font">
                    Called for help {this.state.helpcount} times
                  </h4>
                  {this.state.helpcount === 0 && (
                    <h4 style={{ display: "inline-block" }} className="same_font">
                      (Very Good)
                    </h4>
                  )}
                </div>
                <h4 className="p-2 same_font">It took you {minute * 60 + Number(second)} seconds</h4>
                {sentences[sentenceIndex] !== undefined ? (
                  <>
                    {/* <MDBBtn
                      outline={false}
                      style={{
                        cursor: "pointer",
                        margin: "30px 0",
                        marginRight: "20px",
                        boxShadow: "none",
                      }}
                      color="white"
                      href={`http://www.google.com/search?q=${this.state.inputWord}`}
                      target="_blank"
                    >
                      Google it !
                    </MDBBtn> */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ReactTooltip id="TranslateBtn" place="left" type="dark" effect="solid">
                        <span>Go to Google Translate tool</span>
                      </ReactTooltip>
                      {/* <MDBBtn
                        className="same_font"
                        data-tip
                        data-for="TranslateBtn"
                        outline={false}
                        color="white"
                        style={{
                          cursor: "pointer",
                          margin: "30px 0",
                          boxShadow: "none",
                          display: "inline-block",
                        }}
                        href={`http://translate.google.com?text=${this.state.inputWord}`}
                        target="_blank"
                      >
                        Translate
                      </MDBBtn> */}
                      <a
                        style={{
                          color: "black",
                          fontSize: "20px",
                          cursor: "pointer",
                          display: "inline-block",
                          margin: "20px",
                          fontWeight: "400",
                        }}
                        href={`http://translate.google.com?text=${this.state.inputWord}`}
                        target="_blank"
                      >
                        Translate
                      </a>
                      <ReactTooltip id="NextBtn" place="right" type="dark" effect="solid">
                        <span>Press Enter to get another one</span>
                      </ReactTooltip>
                      <a
                        style={{
                          color: "black",
                          fontSize: "20px",
                          cursor: "pointer",
                          display: "inline-block",
                          margin: "20px",
                          fontWeight: "400",
                        }}
                        onClick={this.nextSentence}
                      >
                        Next
                      </a>
                      {/* <MDBBtn
                        className="same_font"
                        data-tip
                        data-for="NextBtn"
                        outline={false}
                        color="white"
                        style={{
                          cursor: "pointer",
                          boxShadow: "none",
                          display: "inline-block",
                          backgroundColor: "white",
                        }}
                        onClick={this.nextSentence}
                      >
                        Next
                      </MDBBtn> */}
                    </div>
                  </>
                ) : (
                  <div>
                    <h4 className="same_font" style={{ cursor: "pointer" }}>
                      You have learned {masteredCount} {masteredCount > 1 ? "sentences" : "sentence"}!
                    </h4>
                    <MDBBtn
                      className="same_font"
                      color="dark"
                      outline
                      style={{ width: "190px", height: "45px", padding: "4px" }}
                      onClick={this.youLearnItButtonPressed}
                    >
                      <p style={{ fontSize: "20px" }}>YOU LEARNT IT!</p>
                    </MDBBtn>
                  </div>
                )}

                <ReactTooltip id="FullScreen" place="bottom" type="dark" effect="solid">
                  <span>We recommend to turn it on</span>
                </ReactTooltip>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <p
                    className="same_font"
                    style={{ cursor: "pointer" }}
                    onClick={this.toggleFullScreen}
                    data-tip
                    data-for="FullScreen"
                    id="FS"
                  >
                    Full Screen (F11)
                  </p>
                </div>
              </MDBAnimation>
            </div>
          )}
          {/* <ReactTooltip id='FullScreen' place = "bottom" type='dark' effect='solid'>
           <span>We recommend to turn it on
           </span>
          </ReactTooltip>
          <div style = {{display : "flex", justifyContent : "center", marginTop : "100px"}}>
            <MDBBtn onClick = {this.toggleFullScreen} data-tip data-for = "FullScreen" id = "FS" outline color = "dark">
              Full Screen (F11)
            </MDBBtn>
          </div> */}
        </MDBContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  sentences: state.sentences,
  mode: state.mode,
});
const mapDispatchToProps = { setSentences, setMode };

export default connect(mapStateToProps, mapDispatchToProps)(LearningSession);

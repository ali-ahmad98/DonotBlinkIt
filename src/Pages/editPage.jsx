import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import "prismjs/components/prism-erlang";
import "prismjs/themes/prism-twilight.css";
import { connect } from "react-redux";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import { MDBBtn, MDBRow } from "mdbreact";
import "../App.css";
import { setSentences, setMode } from "../store/sentences/action";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import { AlertMessage } from "../components/Alert";
import firebase from "../config/firebaseConfig";
import baseURL from "../config/baseURL";
import { Navbar } from "../components/navbar";
import Switch from "../components/switchSelector";
import { Loader } from "../components/loader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "react-toastify/dist/ReactToastify.css";

class EditCode extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      sentences: [],
      showEditor: false,
      exceed: false,
      sentencesLength: 0,
      isShareLink: false,
      shareUrl: "",
      URLload: false,
      mode: "basic",
      hideMessage: true,
      loader: false,
      hideAll: false,
    };
  }

  componentDidMount() {
    const { sentences } = this.props;

    if (sentences.length > 0) {
      let code = "",
        exceed = false;
      for (const obj of sentences) {
        code += obj.sentence + "\n";
        if (obj.sentence.length >= 40) {
          console.log("Too much length", obj.sentence);
          exceed = true;
        } else {
          console.log("its okey", obj.sentence);
          exceed = false;
        }
      }
      this.setState({ sentences, code, showEditor: true, exceed });
    } else if (this.props.match.params.id) {
      this.setState({ loader: true });
      firebase
        .firestore()
        .collection("sentences")
        .doc(this.props.match.params.id)
        .get()
        .then((response) => {
          const data = response.data();
          let code = "",
            exceed = false;
          for (const obj of data.sentences) {
            code += obj.sentence + "\n";
            if (obj.sentence.length >= 40) {
              exceed = true;
            } else {
              exceed = false;
            }
          }
          this.setState({
            sentences,
            code,
            showEditor: true,
            exceed,
            isShareLink: true,
            loader: false,
          });
        });
    } else {
      this.setState({ showEditor: true });
      this.props.history.push("/");
    }
    this.setState({ sentencesLength: sentences.length });
    this.ExceedAlert();
  }

  splitSentences = () => {
    let { code } = this.state;
    if (code.trim().length === 0) {
      AlertMessage({ message: "Please add some text or paste it" });
      return;
    }

    let sentences = [];
    let signs = ["\n", "?", ".", "!"];
    for (let j = 0; j < code.length; j++) {
      const letter = code[j];
      if (signs.includes(letter)) {
        const index = code.indexOf(letter) + 1;
        const newSentence = code.slice(0, index);
        let removeExtraSigns = newSentence;
        for (let i = index; i < code.length; i++) {
          if (signs.includes(code[i])) {
            removeExtraSigns += code[i];
          } else {
            break;
          }
        }
        j = 0;
        code = code.replace(removeExtraSigns, "");
        if (newSentence.trim()) {
          sentences.push({
            sentence: newSentence.replace(/\s{2,}/g, " ").trim(),
            mastered: null,
            tried: false,
          });
        }
      } else if (j === code.length - 1) {
        const newSentence = code.slice(0, code.length);
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
    this.props.history.push("learning-session");
  };

  ExceedAlert = (code) => {
    if (!code) {
      console.log("1", code);
      this.state.sentences.forEach((Data) => (Data.length >= 60 ? this.setState({ exceed: true }) : null));
    } else if (code) {
      console.log("2", code);
      code.split("\n").forEach((Data) => {
        if (Data.length >= 60) this.setState({ exceed: true });
        else if (this.state.exceed) {
          this.setState({ exceed: false });
        }
      });
      this.setState({ sentencesLength: code.split("\n").length });
    }
    // AlertMessage({ message: 'One of your sentence is too long, try to make it short' })
  };

  shareSet = () => {
    this.setState({ URLload: true });
    let newSentence = [];
    let sentence = this.state.code.split("\n");
    sentence = sentence.filter((data) => data.length !== 0);

    sentence.forEach((data) => {
      if (data.length !== 0) {
        newSentence.push({ sentence: data });
      }
    });
    if (!this.state.shareUrl) {
      firebase
        .firestore()
        .collection("sentences")
        .add({
          sentences: newSentence,
        })
        .then((resp) => {
          this.setState({
            shareUrl: baseURL + "/editCode" + resp.id,
            URLload: false,
          });
          AlertMessage({
            message: "Share this link:",
            link: true,
            href: baseURL + "/editCode" + resp.id,
          });
        });
    }
    this.ChangeMode(this.state.mode);
  };
  ChangeMode = (mode) => {
    if (mode === "basic") {
      this.setState({ mode: "memory" });
    } else if (mode === "memory") {
      this.setState({ mode: "basic" });
    }
    this.props.setMode(this.state.mode);
  };

  render() {
    let options = {
      lineNumbers: true,
    };
    const { isShareLink, URLload } = this.state;
    const { mode } = this.props;

    return (
      <div style={{ height: window.innerHeight }}>
        {this.state.loader && <Loader />}
        {/* navbar */}
        <Navbar quit={false} />
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="row editor-container">
            <div className="col" size={"12"}>
              <div style={{ textAlign: "center" }}>
                <ReactTooltip place="bottom" type="dark" effect="solid" />
                {isShareLink ? (
                  <>
                    <br />
                    <h6>You are about to learn {this.state.sentencesLength} sentences </h6>
                    <h6>Choose the mode of learning. 'Memory' is much more challenging!</h6>
                  </>
                ) : (
                  <>
                    <br />
                    <h6>
                      You are about to learn {this.state.sentencesLength} sentences. <br />
                      Now choose the mode of learning. 'Memory' is much more challenging!
                    </h6>
                  </>
                )}
              </div>
              <MDBRow style={{ textAlign: "center", marginTop: 25 }}>
                <Switch />
              </MDBRow>
              <div
                style={{
                  margin: 30,
                  textAlign: "center",
                  border: "1px solid black",
                  color: "black",
                  padding: "7px 20px",
                  borderRadius: "10px",
                  fontSize: "0.9em",
                }}
              >
                {this.state.hideMessage &&
                  (mode === "focus" ? (
                    <span>
                      Your job is to write the line of text that will flash for a very short time.
                      <br />
                      Make sure the sentences are not too long for you.
                      <br />
                      Edit the text below if you need and start learning. Good luck!
                    </span>
                  ) : (
                    <span>
                      You have to memorize each line of text now. Rewrite them using only one flash.
                      <br />
                      If you use more than one flash for a sentence, it will come back to you until you use only one
                      flash.
                      <br />
                      It pushes you to memorize the text.
                    </span>
                  ))}
              </div>

              {this.state.showEditor && (
                <CodeMirror
                  className="editor"
                  value={this.state.code}
                  onChange={(code) => {
                    this.ExceedAlert(code);
                    this.setState({ code });
                  }}
                  options={options}
                />
              )}
              {this.state.exceed && (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bolder",
                    border: "1px dashed black",
                    marginTop: 10,
                    letterSpacing: 3,
                  }}
                >
                  <small>One of your sentence is too long, try to make it short</small>
                </p>
              )}
              <div className="row mt-3">
                <div className="col">
                  <div style={{ textAlign: "center", margin: 5 }}>
                    <ReactTooltip place="bottom" type="dark" effect="solid" />
                    {URLload ? (
                      <MDBBtn color="black" outline={true}>
                        {"  "}
                        <i className="fa fa-spinner fa-spin" style={{ padding: "0 30px" }}></i>
                        {"  "}
                      </MDBBtn>
                    ) : (
                      <>
                        {this.state.shareUrl !== "" ? (
                          <CopyToClipboard
                            text={this.state.shareUrl}
                            onCopy={() => {
                              AlertMessage({
                                message: "Link has been copied to clpboard",
                              });
                            }}
                            data-tip={this.state.shareUrl}
                          >
                            <MDBBtn color="danger" outline={true}>
                              Copy To Clipboard
                            </MDBBtn>
                          </CopyToClipboard>
                        ) : (
                          <MDBBtn
                            color="black"
                            outline={true}
                            onClick={this.shareSet}
                            style={{ width: "190px", height: "45px", padding: "4px" }}
                            data-tip="Create a link to this set if you want to share it with someone"
                          >
                            <p style={{ fontSize: "20px" }}>Share this set</p>
                          </MDBBtn>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div style={{ textAlign: "center", margin: 5 }}>
                    <MDBBtn
                      color="black"
                      outline={true}
                      style={{ width: "190px", height: "45px", padding: "4px" }}
                      onClick={() => this.splitSentences()}
                    >
                      <p style={{ fontSize: "20px" }}>Start Learning</p>
                    </MDBBtn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tips" style={{ marginTop: "80px", marginBottom: "80px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>Tips and Tricks</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center", textAlign: "left" }}>
            <ol style={{ maxWidth: "825px", textAlign: "justify", padding: "25px" }}>
              <li>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </li>
              <li>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </li>
              <li>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </li>
              <li>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </li>
              <li>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </li>
            </ol>
          </div>
        </div>
        {/* <FullScreenMode /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sentences: state.sentences,
  mode: state.mode,
});

const mapDispatchToProps = { setSentences, setMode };

export default connect(mapStateToProps, mapDispatchToProps)(EditCode);

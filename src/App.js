import React from "react";
import "./App.css";
import InputComponent from "./components/InputComponent/InputComponent";
import Footer from "./components/footer/footer";
import { Navbar } from "./components/navbar";
import FullScreenMode from "./components/FullScreen";
import { ToastContainer } from "react-toastify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      // Words
      words: [
        "hello, monkey eats banana",
        "monkey ,monkey",
        "world, monkey",
        "set on, fire",
        "write your name",
      ],
      per: ["perfect", "amazing", "flawless"],
      selectedNote: "",

      clickedReady: false,
      spans: "",
      inputWord: "",
      hideReady: false,
      hideReadys: true,
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
      showIntroduction: true,
      showReady: true,
      openNav: false,
      desktop: false,
      opacityOfContainer: 1,
      scroll: window.scrollY,
      modal: false,
      modalId: null,
      textToLearn: "",
      alreadyShown: false,
    };
    this.handleInputWord = this.handleInputWord.bind(this);
  }

  handleClick = () => {
    setTimeout(() => {
      this.setState({
        clickedReady: true,
        selectedEnd: this.state.per[
          Math.floor(Math.random() * this.state.per.length)
        ],
        inputHidden: false,
        hideReady: true,
        hideReadys: true,
        perfect: false,
        inputWord: "",
        showWord: true,
        timerOn: true,
        timerTime: this.state.timerTime,
        timerStart: Date.now() - this.state.timerTime,
      });
    }, 6000);
    this.setState({
      showReady: false,
      showWord: false,
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart,
      });
    }, 10);
    const s = this.state.words.length;
    if (s === this.state.in) {
    } else {
      this.setState({
        in: this.state.in + 1,
        selectedNote: this.state.words[Math.floor(this.state.in)],
      });
    }
  };

  componentDidUpdate() {
    if (this.state.words.length === this.state.in) {
      this.setState({
        in: 0,
      });
    }
  }

  componentDidMount = () => {
    let shown = JSON.parse(window.sessionStorage.getItem("alreadyShown"));

    if (shown && shown >= 1) {
      this.setState({ alreadyShown: true });
    } else {
      this.setState({ alreadyShown: false });
    }

    setTimeout(() => {
      this.setState({ showIntroduction: false });
    }, 6000);

    window.addEventListener("scroll", this.UpdateOpacity);
    window.addEventListener("resize", this.UpdateDesktop);
  };

  componentWillMount = () => {
    window.addEventListener("resize", this.UpdateDesktop);
    window.addEventListener("scroll", this.UpdateOpacity);
  };
  UpdateDesktop = () => {
    this.setState({ desktop: !this.state.desktop });
  };
  handleInputWord = (e) => {
    //Here is the color validaiton(don't touch anything here)

    let inputStyle = {
      color: "black",
      borderBottomColor: "black",
    };
    let inputText = this.state.inputWord.split(" ");

    for (var i = 0; i < inputText.length; i++) {
      if (this.state.selectedNote.includes(inputText[i]) === true) {
        if (
          this.state.inputWord.indexOf(inputText[i]) ===
          this.state.selectedNote.indexOf(inputText[i])
        ) {
          inputStyle = {
            color: "blue",
            // borderBottomColor: 'blue'
          };
        } else {
          inputStyle = {
            color: "yellow",
            // borderBottomColor: 'yellow'
          };
        }
      } else {
        inputStyle = {
          color: "black",
          // borderBottomColor: 'black'
        };
      }
    }

    if (e.target.value === this.state.selectedNote) {
      this.setState({
        perfect: true,
        inputHidden: true,
        inputWord: e.target.value,
        inputStyle,
        timerOn: false,
      });
      this.setState({ inputWord: e.target.value });
      clearInterval(this.timer);
    } else {
      this.setState({
        againHidden: false,
        inputStyle,
        inputWord: e.target.value,
      });
    }
  };

  handleAgain = () => {
    //Here is the counter of flashes and length of the first flash logic
    var inc = 200 + this.state.countsec;
    setTimeout(() => {
      this.setState({
        showWord: true,
        inputHidden: false,
      });
    }, inc);
    this.setState({
      count: this.state.count + 1,
      countsec: this.state.countsec + 200,
      showWord: false,
      inputHidden: true,
    });
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
      startLearning: false,
    });
  };

  routeToLearning = () => {
    this.setState({ startLearning: !this.state.startLearning });
    clearInterval(this.timer);
  };
  SideBar = () => {
    this.setState({ openNav: !this.state.openNav });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  addTextToLearn = (text) => {
    this.setState({ textToLearn: text });
  };
  modalId = (id) => {
    this.setState({ modalId: id });
  };
  render() {
    const { showIntroduction, alreadyShown } = this.state;

    return (
      <>
        {/* navbar */}
        <Navbar quit={false} />
        {/* nav and side bar ends here */}
        {/* Slider starts */}
        <div
          style={{
            height:
              window.innerWidth > 700
                ? window.innerHeight
                : window.innerHeight + 400,
          }}
        >
          <div
            className="App-header"
            style={{ opacity: this.state.opacityOfContainer }}
            onClick={() => this.setState({ showIntroduction: false })}
          >
            {/* this is the animation of the logo */}
            {/* {showIntroduction && !alreadyShown ?
              <div className="os-phrases" >
                <h2 hidden={this.state.hideReady}>learn any text</h2>
                <h2 hidden={this.state.hideReady}>focus on detail</h2>
                <h2 hidden={this.state.hideReady}><span className="blinking">do not</span> blink</h2>
                <h2 hidden={this.state.hideReady}>.</h2>
              </div> : */}
            <InputComponent
              textToLearn={this.state.textToLearn}
              modalIdFunc={this.modalId}
              move={this.routeToLearning}
              modalId={this.state.modalId}
              toggle={this.toggle}
              navigate={this.props.history.push}
              modal={this.state.modal}
            />
            {/* } */}
          </div>
        </div>
        <Footer />
      </>
    );
  }
}
export default App;

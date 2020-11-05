import React, { Component } from 'react';
import { MDBBtn } from "mdbreact"
import './style.css';
import { connect } from 'react-redux';
import { AlertMessage } from '../../components/Alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import firebase from '../../config/firebaseConfig';
import baseURL from '../../config/baseURL';
import { Navbar } from '../../components/navbar';
import FullScreenMode from '../../components/FullScreen';
import ReactTooltip from "react-tooltip";
import { ToastContainer } from 'react-toastify';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openNav: false,
            isLastSkipped: false,
            sentencesLearned: 0,
            shareUrl: '',
            URLload: false
        }
    }
    shareSet = () => {
        this.setState({ URLload: true })
        if (!this.state.shareUrl) {

            firebase.firestore().collection('sentences').add({
                sentences: this.props.sentences
            }).then(resp => {
                this.setState({ shareUrl: baseURL + '/editCode' + resp.id, URLload: false })
                AlertMessage({ message: `Share this link:`, link: true, href: baseURL + '/editCode' + resp.id });
            })
        }
    }
    SideBar = () => {
        this.setState({ openNav: !this.state.openNav })
    }
    componentWillMount() {
        this.props.sentences.length === 0 && this.props.history.push('/')
    }
    componentDidMount() {
        let { sentences } = this.props

        let count = 0;
        let isLastSkipped = false;
        for (let sentenceObj of sentences) {
            if (sentenceObj.tried) {
                count++
            }
            isLastSkipped = !sentenceObj.tried
        }
        this.setState({ sentencesLearned: count, isLastSkipped })
        window.addEventListener('keypress', (e) => {
            if (e.keycode === 13) {
                this.props.history.push("/")
                this.removeEvent()
            }
        })
    }

    removeEvent = () => {
        window.removeEventListener('keypress', (e) => {
            if (e.keycode === 13) {
                this.props.history.push("/")
            }
        })
    }
    render() {
        let { sentencesLearned, isLastSkipped, shareUrl, URLload } = this.state;

        return (<>

            {/* navbar */}
            <Navbar quit={true} />
            <ReactTooltip place="bottom" type="dark" effect="solid" />
            <div className="result_container">
                {sentencesLearned === 0 ? <div>
                    <h4 style={{ cursor: "pointer" }}>You haven't learned anything!</h4>
                    <MDBBtn outline={true} color="warning" onClick={() => this.props.history.push("/")} style={{ borderRadius: 50 }}>
                        Try Again!
                        </MDBBtn>
                </div> :

                    <div>
                        {!isLastSkipped ? <h4 style={{ cursor: "pointer" }}>You learnt it!</h4> : < h4 style={{ cursor: "pointer" }}>you have learned {sentencesLearned} {sentencesLearned > 1 ? 'sentences' : 'sentence'}!</h4>}
                        <MDBBtn data-tip="Press Enter to find another set to learn." outline={true} color="warning" onClick={() => this.props.history.push("/")} style={{ borderRadius: 50 }}>
                            Did you like it? Start a new set.
                    </MDBBtn>
                        <h4 style={{ cursor: "pointer" }}>Test your friends!</h4>
                        {URLload ?
                            <MDBBtn color="warning" outline={true} >{'  '}<i className="fa fa-spinner fa-spin" style={{ padding: '0 30px' }}></i>{'  '}</MDBBtn>
                            :
                            <>
                                {this.state.shareUrl !== '' ?
                                    <CopyToClipboard text={this.state.shareUrl} onCopy={() => {
                                        AlertMessage({ message: 'Link has been copied to clpboard' })
                                    }} >
                                        <MDBBtn color="danger" outline={true} data-tip="Copy the link to clipboard">
                                        Now Copy the Link Here!
                                </MDBBtn>
                                    </CopyToClipboard>
                                    :
                                    <MDBBtn color="warning" outline={true} onClick={this.shareSet} data-tip="Send the link to anyone">
                                        Share this set
                            </MDBBtn>}
                            </>}

                    </div>}
                <FullScreenMode />
            </div>
        </>)
    }
}




const mapStateToProps = state => ({
    sentences: state.sentences
})


export default connect(mapStateToProps)(Result);